export interface UserData {
    _id: number;
    email: string;
    profile: IProfile;
}

interface IProfile {
    firstName: string;
    lastName?: string;
    image?: string;
    role?: string;
    organization?: string;
  }