import { CategoryENtityCreation, CityEntityCreation, ClientEntityCreation, EmployeeEntityCreation, GovernorateEntityCreation, OwnerEntityCreation, PersonNoteEntityCreation, PropertyEntityCreation } from "@/types/entities";
import { ForgotPasswordProps, LoginProps, ResetForgottenPasswordProps } from "@/types/forms";
import { PropertyDuration, PropertyPurpose, PropertyStatus } from "@/types/variables";

export const loginInItalValues: LoginProps = {
  email: "",
  password: "",
};

export const forgotPasswordInitialValues: ForgotPasswordProps = {
  email: "",
};

export const resetPasswordInitialValues: ResetForgottenPasswordProps = {
  otp: "",
  password: "",
};

export const initialGovernorateCreationValues: GovernorateEntityCreation = {
  name: "",
};

export const initialCityCreationValues: CityEntityCreation = {
  name: "",
};

export const initialClientCreationValues: ClientEntityCreation = {
  fullName: "",
  phone: "",
  email: "",
  cityId: 0,
  budget: undefined,
};

export const initialClientNoteValues: PersonNoteEntityCreation = {
  note: "",
};

export const initialEmployeeCreationValues: EmployeeEntityCreation = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  roleId: undefined,
  city: ""
};

export const initialCategoryCreationValues: CategoryENtityCreation = {
  name: "",
  icon: "",
};

export const initialOwnerCreationValues: OwnerEntityCreation = {
  fullName: "",
  phone: "",
  email: "",
  cityId: 0,
};

export const initialPropertyCreationValues: PropertyEntityCreation = {
  title: "",
  location: "",
  cityId: 0,
  categoryId: 0,
  ownerId: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  area: undefined,
  desc: "",
  map: "",
  status: PropertyStatus.AVAILABLE,
  price: 0,
  duration: PropertyDuration.YEARLY,
  purpose: PropertyPurpose.SALE,
  features: [],
};

export const initialChangePasswordValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

export const initialRolePermissionsValues = {
  rolePermissions: {
    name: "",
    description: "",
    permissionsIds: [],
    _itemStates: {},
  },
};