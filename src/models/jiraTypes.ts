export interface JiraOption {
  id: string;

  value: string;
}

export interface JiraFieldMetadata {
  key: string;

  name: string;

  required: boolean;

  options?: JiraOption[];
}

export interface JiraMetadata {
  projectId: string;

  projectName: string;

  issueTypes: JiraOption[];

  fields: JiraFieldMetadata[];
}
