import { Request, Response } from 'express';
import { VisionService } from '../../modules/vision/VisionService';

const visionService = new VisionService();

export class VisionController {
  async analyzeFrame(req: Request, res: Response) {
    const { imageBase64 } = req.body;
    const result = await visionService.analyzeFrame(imageBase64);
    return res.json(result);
  }
}
