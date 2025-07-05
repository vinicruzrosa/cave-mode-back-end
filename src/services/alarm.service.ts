import path from 'path';
import fs from 'fs/promises';
import { AlarmRepository } from '../repositories/alarm.repository';
import { CreateAlarmRequest, UpdateAlarmRequest, AlarmResponse, SelfieResponse, LightVerificationResult } from '../types/alarm';

// Import sharp conditionally to avoid issues in test environment
let sharp: any;
try {
  sharp = require('sharp');
} catch {
  // Mock sharp for test environment
  sharp = {
    async metadata() { return {}; },
    resize() { return this; },
    raw() { return this; },
    toBuffer() { return { data: new Uint8Array(30000) }; }
  };
}

export class AlarmService {
  private repository: AlarmRepository;
  private uploadDir: string;

  constructor() {
    this.repository = new AlarmRepository();
    this.uploadDir = path.join(process.cwd(), 'uploads', 'selfies');
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async createAlarm(userId: number, data: CreateAlarmRequest): Promise<AlarmResponse> {
    const time = new Date(data.time);
    
    // Validar se o horário não é no passado
    if (time <= new Date()) {
      throw new Error('Alarm time must be in the future');
    }

    const alarm = await this.repository.create(userId, time, data.repeat);
    
    return {
      id: alarm.id,
      userId: alarm.userId,
      time: alarm.time.toISOString(),
      active: alarm.active,
      repeat: alarm.repeat,
      createdAt: alarm.createdAt.toISOString(),
      updatedAt: alarm.updatedAt.toISOString()
    };
  }

  async getAlarms(userId: number): Promise<AlarmResponse[]> {
    const alarms = await this.repository.findByUserId(userId);
    
    return alarms.map((alarm: any) => ({
      id: alarm.id,
      userId: alarm.userId,
      time: alarm.time.toISOString(),
      active: alarm.active,
      repeat: alarm.repeat,
      createdAt: alarm.createdAt.toISOString(),
      updatedAt: alarm.updatedAt.toISOString()
    }));
  }

  async getActiveAlarms(userId: number): Promise<AlarmResponse[]> {
    const alarms = await this.repository.findActiveByUserId(userId);
    
    return alarms.map((alarm: any) => ({
      id: alarm.id,
      userId: alarm.userId,
      time: alarm.time.toISOString(),
      active: alarm.active,
      repeat: alarm.repeat,
      createdAt: alarm.createdAt.toISOString(),
      updatedAt: alarm.updatedAt.toISOString()
    }));
  }

  async updateAlarm(userId: number, alarmId: number, data: UpdateAlarmRequest): Promise<AlarmResponse> {
    // Verificar se o alarme pertence ao usuário
    const alarm = await this.repository.findById(alarmId);
    if (!alarm || alarm.userId !== userId) {
      throw new Error('Alarm not found or access denied');
    }

    const updateData: any = {};
    if (data.time) {
      const time = new Date(data.time);
      if (time <= new Date()) {
        throw new Error('Alarm time must be in the future');
      }
      updateData.time = time;
    }
    if (data.repeat !== undefined) updateData.repeat = data.repeat;
    if (data.active !== undefined) updateData.active = data.active;

    const updatedAlarm = await this.repository.update(alarmId, updateData);
    
    return {
      id: updatedAlarm.id,
      userId: updatedAlarm.userId,
      time: updatedAlarm.time.toISOString(),
      active: updatedAlarm.active,
      repeat: updatedAlarm.repeat,
      createdAt: updatedAlarm.createdAt.toISOString(),
      updatedAt: updatedAlarm.updatedAt.toISOString()
    };
  }

  async deleteAlarm(userId: number, alarmId: number): Promise<void> {
    // Verificar se o alarme pertence ao usuário
    const alarm = await this.repository.findById(alarmId);
    if (!alarm || alarm.userId !== userId) {
      throw new Error('Alarm not found or access denied');
    }

    await this.repository.delete(alarmId);
  }

  async processSelfie(userId: number, alarmId: number, imageBuffer: Buffer): Promise<SelfieResponse> {
    // Verificar se o alarme pertence ao usuário e está ativo
    const alarm = await this.repository.findById(alarmId);
    if (!alarm || alarm.userId !== userId) {
      throw new Error('Alarm not found or access denied');
    }

    if (!alarm.active) {
      throw new Error('Alarm is not active');
    }

    // Verificar luz natural na imagem
    const lightResult = await this.verifyNaturalLight(imageBuffer);
    
    // Salvar imagem
    const filename = `selfie_${alarmId}_${Date.now()}.jpg`;
    const imagePath = path.join(this.uploadDir, filename);
    await fs.writeFile(imagePath, imageBuffer);

    // Criar registro da selfie
    const selfie = await this.repository.createSelfie(
      alarmId,
      imagePath,
      lightResult.brightness,
      lightResult.approved
    );

    // Se a luz foi aprovada, desativar o alarme
    if (lightResult.approved) {
      await this.repository.update(alarmId, { active: false });
    }

    return {
      id: selfie.id,
      alarmId: selfie.alarmId,
      imagePath: selfie.imagePath,
      brightness: selfie.brightness,
      approved: selfie.approved,
      createdAt: selfie.createdAt.toISOString()
    };
  }

  private async verifyNaturalLight(imageBuffer: Buffer): Promise<LightVerificationResult> {
    try {
      // Processar imagem com sharp
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      // Converter para RGB e obter dados dos pixels
      const { data } = await image
        .resize(100, 100) // Reduzir para processamento mais rápido
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Calcular brilho médio
      let totalBrightness = 0;
      const pixelCount = data.length / 3; // 3 canais RGB

      for (let i = 0; i < data.length; i += 3) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Fórmula para calcular brilho: 0.299*R + 0.587*G + 0.114*B
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / pixelCount;
      
      // Definir limiares para luz natural
      const MIN_BRIGHTNESS = 80; // Mínimo para considerar luz natural
      const MAX_BRIGHTNESS = 250; // Máximo para evitar imagens muito claras/brancas
      
      const approved = averageBrightness >= MIN_BRIGHTNESS && averageBrightness <= MAX_BRIGHTNESS;
      
      let message = '';
      if (averageBrightness < MIN_BRIGHTNESS) {
        message = 'Imagem muito escura. Tire uma selfie em um local com mais luz natural.';
      } else if (averageBrightness > MAX_BRIGHTNESS) {
        message = 'Imagem muito clara. Evite tirar selfie diretamente contra a luz.';
      } else {
        message = 'Luz natural verificada com sucesso!';
      }

      return {
        brightness: Math.round(averageBrightness),
        approved,
        message
      };

    } catch (error: any) {
      throw new Error('Erro ao processar imagem: ' + error.message);
    }
  }

  async getSelfiesByAlarm(userId: number, alarmId: number): Promise<SelfieResponse[]> {
    // Verificar se o alarme pertence ao usuário
    const alarm = await this.repository.findById(alarmId);
    if (!alarm || alarm.userId !== userId) {
      throw new Error('Alarm not found or access denied');
    }

    const selfies = await this.repository.getSelfiesByAlarmId(alarmId);
    
    return selfies.map((selfie: any) => ({
      id: selfie.id,
      alarmId: selfie.alarmId,
      imagePath: selfie.imagePath,
      brightness: selfie.brightness,
      approved: selfie.approved,
      createdAt: selfie.createdAt.toISOString()
    }));
  }
} 