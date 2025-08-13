export class CreateChargerDto {
  id: string;
  status: 'available' | 'in_use' | 'offline';
}
