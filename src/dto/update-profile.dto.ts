export class UpdateProfileDto {
  readonly name: string;
  readonly birthday: string;
  readonly height: number;
  readonly weight: number;
  readonly interests: [string];
}
