export interface ISettings {
  url: string,
  baseAPIUrl: string,
  apiVersion: string,
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string,
  subtitle: string
}

export type ID = number

export type CommonParentProps = {
  readonly children: React.ReactNode
}