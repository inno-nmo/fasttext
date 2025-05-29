export interface WebexEmployee {
  notFoundIds: string[] | null;
  items: WebexEmployeeItem[];
}

export interface WebexEmployeeItem {
  id: string;
  emails: string[];
  phoneNumbers: WebexPhoneNumber[];
  displayName: string;
  nickName: string;
  firstName: string;
  lastName: string;
  orgId: string;
  created: string; // ISO date string
  lastModified: string; // ISO date string
  lastActivity: string; // ISO date string
  status: 'active' | 'inactive' | string;
  type: 'person' | 'bot' | string;
  department: string;
  title: string;
  addresses: WebexAddress[];
}

export interface WebexPhoneNumber {
  type: 'work' | 'mobile' | string;
  value: string;
  primary: boolean;
}

export interface WebexAddress {
  country: string;
  locality: string;
  region: string;
  streetAddress: string;
  type: 'work' | string;
  postalCode: string;
}

export type WebexMessageResponse = {
  id: string;
  roomId: string;
  toPersonId?: string; // optional: only present for direct messages
  roomType: "direct" | "group";
  text?: string;
  personId: string;
  personEmail: string;
  created: string; // ISO 8601 datetime string
};

export type SendWebexMessageParams = {
  personalId: string;
  text: string;
};