import path from 'path';
import fs from 'fs/promises';
import { AlarmRepository } from '../repositories/alarm.repository';
import { CreateAlarmRequest, UpdateAlarmRequest, AlarmResponse, SelfieResponse, LightVerificationResult } from '../types/alarm';
import { alarmLogger } from '../utils/logger';

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
      await alarmLogger.debug('ensureUploadDir', 'Upload directory already exists', { uploadDir: this.uploadDir });
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await alarmLogger.info('ensureUploadDir', 'Upload directory created', { uploadDir: this.uploadDir });
    }
  }

  async createAlarm(userId: number, data: CreateAlarmRequest): Promise<AlarmResponse> {
    return alarmLogger.timeOperation(
      'createAlarm',
      async () => {
        await alarmLogger.info('createAlarm', 'Creating new alarm', { userId, alarmData: data });
        
        const time = new Date(data.time);
        
        // Validar se o horário não é no passado
        if (time <= new Date()) {
          await alarmLogger.error('createAlarm', 'Alarm time is in the past', null, { userId, time: data.time });
          throw new Error('Alarm time must be in the future');
        }

        const alarm = await this.repository.create(userId, time, data.repeat);
        
        await alarmLogger.info('createAlarm', 'Alarm created successfully', { 
          userId, 
          alarmId: alarm.id, 
          time: alarm.time.toISOString(),
          repeat: alarm.repeat 
        });
        
        return {
          id: alarm.id,
          userId: alarm.userId,
          time: alarm.time.toISOString(),
          active: alarm.active,
          repeat: alarm.repeat,
          createdAt: alarm.createdAt.toISOString(),
          updatedAt: alarm.updatedAt.toISOString()
        };
      },
      'Create new alarm',
      userId,
      data
    );
  }

  async getAlarms(userId: number): Promise<AlarmResponse[]> {
    return alarmLogger.timeOperation(
      'getAlarms',
      async () => {
        await alarmLogger.debug('getAlarms', 'Fetching all alarms for user', { userId });
        
        const alarms = await this.repository.findByUserId(userId);
        
        await alarmLogger.info('getAlarms', 'Alarms retrieved successfully', { 
          userId, 
          count: alarms.length 
        });
        
        return alarms.map((alarm: any) => ({
          id: alarm.id,
          userId: alarm.userId,
          time: alarm.time.toISOString(),
          active: alarm.active,
          repeat: alarm.repeat,
          createdAt: alarm.createdAt.toISOString(),
          updatedAt: alarm.updatedAt.toISOString()
        }));
      },
      'Get all alarms for user',
      userId
    );
  }

  async getActiveAlarms(userId: number): Promise<AlarmResponse[]> {
    return alarmLogger.timeOperation(
      'getActiveAlarms',
      async () => {
        await alarmLogger.debug('getActiveAlarms', 'Fetching active alarms for user', { userId });
        
        const alarms = await this.repository.findActiveByUserId(userId);
        
        await alarmLogger.info('getActiveAlarms', 'Active alarms retrieved successfully', { 
          userId, 
          count: alarms.length 
        });
        
        return alarms.map((alarm: any) => ({
          id: alarm.id,
          userId: alarm.userId,
          time: alarm.time.toISOString(),
          active: alarm.active,
          repeat: alarm.repeat,
          createdAt: alarm.createdAt.toISOString(),
          updatedAt: alarm.updatedAt.toISOString()
        }));
      },
      'Get active alarms for user',
      userId
    );
  }

  async getAlarmById(userId: number, alarmId: number): Promise<AlarmResponse> {
    return alarmLogger.timeOperation(
      'getAlarmById',
      async () => {
        await alarmLogger.debug('getAlarmById', 'Fetching specific alarm', { userId, alarmId });
        
        const alarm = await this.repository.findById(alarmId);
        
        if (!alarm || alarm.userId !== userId) {
          await alarmLogger.error('getAlarmById', 'Alarm not found or access denied', null, { 
            userId, 
            alarmId, 
            alarmUserId: alarm?.userId 
          });
          throw new Error('Alarm not found or access denied');
        }
        
        await alarmLogger.info('getAlarmById', 'Alarm retrieved successfully', { 
          userId, 
          alarmId 
        });
        
        return {
          id: alarm.id,
          userId: alarm.userId,
          time: alarm.time.toISOString(),
          active: alarm.active,
          repeat: alarm.repeat,
          createdAt: alarm.createdAt.toISOString(),
          updatedAt: alarm.updatedAt.toISOString()
        };
      },
      'Get specific alarm by ID',
      userId,
      { alarmId }
    );
  }

  async updateAlarm(userId: number, alarmId: number, data: UpdateAlarmRequest): Promise<AlarmResponse> {
    return alarmLogger.timeOperation(
      'updateAlarm',
      async () => {
        await alarmLogger.info('updateAlarm', 'Updating alarm', { userId, alarmId, updateData: data });
        
        // Verificar se o alarme pertence ao usuário
        const alarm = await this.repository.findById(alarmId);
        if (!alarm || alarm.userId !== userId) {
          await alarmLogger.error('updateAlarm', 'Alarm not found or access denied', null, { 
            userId, 
            alarmId, 
            alarmUserId: alarm?.userId 
          });
          throw new Error('Alarm not found or access denied');
        }

        const updateData: any = {};
        if (data.time) {
          const time = new Date(data.time);
          if (time <= new Date()) {
            await alarmLogger.error('updateAlarm', 'Alarm time is in the past', null, { 
              userId, 
              alarmId, 
              time: data.time 
            });
            throw new Error('Alarm time must be in the future');
          }
          updateData.time = time;
        }
        if (data.repeat !== undefined) updateData.repeat = data.repeat;
        if (data.active !== undefined) updateData.active = data.active;

        const updatedAlarm = await this.repository.update(alarmId, updateData);
        
        await alarmLogger.info('updateAlarm', 'Alarm updated successfully', { 
          userId, 
          alarmId, 
          updatedFields: Object.keys(updateData) 
        });
        
        return {
          id: updatedAlarm.id,
          userId: updatedAlarm.userId,
          time: updatedAlarm.time.toISOString(),
          active: updatedAlarm.active,
          repeat: updatedAlarm.repeat,
          createdAt: updatedAlarm.createdAt.toISOString(),
          updatedAt: updatedAlarm.updatedAt.toISOString()
        };
      },
      'Update alarm',
      userId,
      { alarmId, ...data }
    );
  }

  async deleteAlarm(userId: number, alarmId: number): Promise<void> {
    return alarmLogger.timeOperation(
      'deleteAlarm',
      async () => {
        await alarmLogger.info('deleteAlarm', 'Deleting alarm', { userId, alarmId });
        
        // Verificar se o alarme pertence ao usuário
        const alarm = await this.repository.findById(alarmId);
        if (!alarm || alarm.userId !== userId) {
          await alarmLogger.error('deleteAlarm', 'Alarm not found or access denied', null, { 
            userId, 
            alarmId, 
            alarmUserId: alarm?.userId 
          });
          throw new Error('Alarm not found or access denied');
        }

        await this.repository.delete(alarmId);
        
        await alarmLogger.info('deleteAlarm', 'Alarm deleted successfully', { userId, alarmId });
      },
      'Delete alarm',
      userId,
      { alarmId }
    );
  }

  async processSelfie(userId: number, alarmId: number, imageBuffer: Buffer): Promise<SelfieResponse> {
    return alarmLogger.timeOperation(
      'processSelfie',
      async () => {
        await alarmLogger.info('processSelfie', 'Processing selfie for alarm', { 
          userId, 
          alarmId, 
          imageSize: imageBuffer.length 
        });
        
        // Verificar se o alarme pertence ao usuário e está ativo
        const alarm = await this.repository.findById(alarmId);
        if (!alarm || alarm.userId !== userId) {
          await alarmLogger.error('processSelfie', 'Alarm not found or access denied', null, { 
            userId, 
            alarmId, 
            alarmUserId: alarm?.userId 
          });
          throw new Error('Alarm not found or access denied');
        }

        if (!alarm.active) {
          await alarmLogger.error('processSelfie', 'Alarm is not active', null, { 
            userId, 
            alarmId, 
            alarmActive: alarm.active 
          });
          throw new Error('Alarm is not active');
        }

        // Verificar luz natural na imagem
        await alarmLogger.debug('processSelfie', 'Verifying natural light in image', { userId, alarmId });
        const lightResult = await this.verifyNaturalLight(imageBuffer);
        
        await alarmLogger.info('processSelfie', 'Light verification completed', { 
          userId, 
          alarmId, 
          brightness: lightResult.brightness,
          approved: lightResult.approved 
        });
        
        // Salvar imagem
        const filename = `selfie_${alarmId}_${Date.now()}.jpg`;
        const imagePath = path.join(this.uploadDir, filename);
        
        try {
          await fs.writeFile(imagePath, imageBuffer);
          await alarmLogger.debug('processSelfie', 'Image saved successfully', { 
            userId, 
            alarmId, 
            filename, 
            imagePath 
          });
        } catch (error) {
          await alarmLogger.error('processSelfie', 'Failed to save image', error, { 
            userId, 
            alarmId, 
            filename, 
            imagePath 
          });
          throw error;
        }

        // Criar registro da selfie
        const selfie = await this.repository.createSelfie(
          alarmId,
          imagePath,
          lightResult.brightness,
          lightResult.approved
        );

        await alarmLogger.info('processSelfie', 'Selfie record created', { 
          userId, 
          alarmId, 
          selfieId: selfie.id,
          brightness: selfie.brightness,
          approved: selfie.approved 
        });

        // Se a luz foi aprovada, desativar o alarme
        if (lightResult.approved) {
          await this.repository.update(alarmId, { active: false });
          await alarmLogger.info('processSelfie', 'Alarm deactivated due to approved light', { 
            userId, 
            alarmId 
          });
        }

        return {
          id: selfie.id,
          alarmId: selfie.alarmId,
          imagePath: selfie.imagePath,
          brightness: selfie.brightness,
          approved: selfie.approved,
          createdAt: selfie.createdAt.toISOString()
        };
      },
      'Process selfie for alarm',
      userId,
      { alarmId, imageSize: imageBuffer.length }
    );
  }

  private async verifyNaturalLight(imageBuffer: Buffer): Promise<LightVerificationResult> {
    return alarmLogger.timeOperation(
      'verifyNaturalLight',
      async () => {
        try {
          await alarmLogger.debug('verifyNaturalLight', 'Processing image with sharp', { 
            imageSize: imageBuffer.length 
          });
          
          // Processar imagem com sharp
          const image = sharp(imageBuffer);
          const metadata = await image.metadata();
          
          await alarmLogger.debug('verifyNaturalLight', 'Image metadata retrieved', { 
            width: metadata.width,
            height: metadata.height,
            format: metadata.format 
          });
          
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

          await alarmLogger.info('verifyNaturalLight', 'Light verification completed', { 
            averageBrightness: Math.round(averageBrightness),
            approved,
            message,
            minThreshold: MIN_BRIGHTNESS,
            maxThreshold: MAX_BRIGHTNESS 
          });

          return {
            brightness: Math.round(averageBrightness),
            approved,
            message
          };

        } catch (error: any) {
          await alarmLogger.error('verifyNaturalLight', 'Error processing image', error, { 
            imageSize: imageBuffer.length 
          });
          throw new Error('Erro ao processar imagem: ' + error.message);
        }
      },
      'Verify natural light in image'
    );
  }

  async getSelfiesByAlarm(userId: number, alarmId: number): Promise<SelfieResponse[]> {
    return alarmLogger.timeOperation(
      'getSelfiesByAlarm',
      async () => {
        await alarmLogger.debug('getSelfiesByAlarm', 'Fetching selfies for alarm', { userId, alarmId });
        
        // Verificar se o alarme pertence ao usuário
        const alarm = await this.repository.findById(alarmId);
        if (!alarm || alarm.userId !== userId) {
          await alarmLogger.error('getSelfiesByAlarm', 'Alarm not found or access denied', null, { 
            userId, 
            alarmId, 
            alarmUserId: alarm?.userId 
          });
          throw new Error('Alarm not found or access denied');
        }

        const selfies = await this.repository.getSelfiesByAlarmId(alarmId);
        
        await alarmLogger.info('getSelfiesByAlarm', 'Selfies retrieved successfully', { 
          userId, 
          alarmId, 
          count: selfies.length 
        });
        
        return selfies.map((selfie: any) => ({
          id: selfie.id,
          alarmId: selfie.alarmId,
          imagePath: selfie.imagePath,
          brightness: selfie.brightness,
          approved: selfie.approved,
          createdAt: selfie.createdAt.toISOString()
        }));
      },
      'Get selfies by alarm',
      userId,
      { alarmId }
    );
  }
} 