import{
    CreateReportDto,
} from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';

export interface Report {
  _id?: string; 
  title: string;
  location: string;
  image_url: string;
  category: 'seguridad' | 'infraestructura' | 'vandalismo' | 'otro';
  state: 'pendiente' | 'en proceso' | 'terminada';
  user_email: string;
  creation_date: Date;
}
export interface Comment{
  _id?: string;
  location: string;
  user_email: string;
  creation_date: Date;
}
export interface ReportsServiceInterface{
    create(createReportDto: CreateReportDto, email: string): Promise<Report>;
    update(updateReportDto:UpdateReportDto):Promise<Report>;
    delete(id: string): Promise<String>;
    findById(id: string): Promise<Report | null>;
    findAll(): Promise<Report[]>;
}