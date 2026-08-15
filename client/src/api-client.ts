import { APIResponse, UpdateItemType, UpdateItemWithFormData } from "./libraries/react-query/types";
import { CategoryEntity, CategoryENtityCreation, CityEntity, ClientEntity, ClientEntityCreation, EmployeeEntity, EmployeeEntityCreation, FavoritePropertyEntity, GovernorateEntity, GovernorateEntityCreation, OwnerEntity, OwnerEntityCreation, OwnerPropertyEntity, PersonNoteEntity, PropertyEntity, PropertyFeatureEntity, PropertyIdentifiersEntity, PropertyImageEntity, PropertyNoteEntity, PropertyPlanEntity, RoleEntity, UserEntity } from "./types/entities";
import { ForgotPasswordProps, LoginProps, ResetForgottenPasswordProps, ResetPasswordProps } from "./types/forms";
import { ID } from "./types/global";
import { assignPropertyToOwnerParams, CreateCityParams, CreateClientFavoriteParams, CreatePersonNoteParams, CreatePropertyNoteParams, DeleteCityParams, DeleteClientFavoriteParams, DeletePersonNoteParams, DeletePropertyImageParams, DeletePropertyNoteParams, DeletePropertyPlanParams, GetClientsParams, GetEmployeesParams, GetOwnersParams, GetPropertiesParams, UpdateCityParams } from "./types/queries";
import { setSessionItem } from "./utils/helpers";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
const API_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`
const USER_INFO = process.env.NEXT_PUBLIC_USER_INFO!

export const validateAuthentication = async (): Promise<APIResponse<UserEntity>> => {
  const response = await fetch(`${API_URL}/auth/verify-me`, {
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  if (responseBody.data) {
    setSessionItem(USER_INFO, {
      username: `${responseBody.data.firstName} ${responseBody.data.lastName}`,
      email: responseBody.data.email
    });
  }

  return responseBody;
};

export const login = async (formData: LoginProps) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const forgotPassword = async (formData: ForgotPasswordProps) => {
  const response = await fetch(`${API_URL}/auth/forgot-password/${formData.email}`, {
    method: "PATCH",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const resetForgottenPassword = async (formData: ResetForgottenPasswordProps) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const changePassword = async (data: ResetPasswordProps) => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    credentials: "include",
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllClients = async (params: GetClientsParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("l", params.limit.toString());
  if (params.page) queryParams.append("p", params.page.toString());
  if (params.offset) queryParams.append("o", params.offset.toString());
  if (params.search) queryParams.append("s", params.search);

  const response = await fetch(`${API_URL}/clients?${queryParams.toString()}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch clients");

  return responseBody;
};

export const getAllClientsIdentifiers = async () => {
  const response = await fetch(`${API_URL}/clients/identifiers`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owners");

  return responseBody;
};

export const getClientById = async (id: ID): Promise<APIResponse<ClientEntity>> => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch client");

  return responseBody;
};

export const getClientFavoritesPropertiesById = async (id: ID): Promise<APIResponse<FavoritePropertyEntity[]>> => {
  const response = await fetch(`${API_URL}/clients/${id}/favorites`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch client");

  return responseBody;
};

export const getClientUnFavoritesPropertiesById = async (id: ID): Promise<APIResponse<FavoritePropertyEntity[]>> => {
  const response = await fetch(`${API_URL}/clients/${id}/unfavorite-properties`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch client");

  return responseBody;
};

export const createClient = async (payload: ClientEntityCreation): Promise<APIResponse<ClientEntity>> => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create client");

  return responseBody;
};

export const createClientFavorite = async (payload: CreateClientFavoriteParams): Promise<APIResponse<FavoritePropertyEntity>> => {
  const response = await fetch(`${API_URL}/clients/${payload.clientId}/favorites/${payload.propertyId}`, {
    method: "POST",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create client");

  return responseBody;
};

export const updateClient = async ({ id, data }: UpdateItemType<ClientEntityCreation>): Promise<APIResponse<ClientEntity>> => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update client");

  return responseBody;
};

export const deleteClientById = async (id: ID) => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete client");

  return responseBody;
};

export const deleteClientFavorite = async (payload: DeleteClientFavoriteParams): Promise<APIResponse<FavoritePropertyEntity>> => {
  const response = await fetch(`${API_URL}/clients/${payload.clientId}/favorites/${payload.propertyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete client");

  return responseBody;
};

export const getPersonNotes = async (personId: ID): Promise<APIResponse<PersonNoteEntity[]>> => {
  const response = await fetch(`${API_URL}/persons/${personId}/notes`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch client notes");

  return responseBody;
};

export const createPersonNote = async ({ personId, payload }: CreatePersonNoteParams): Promise<APIResponse<PersonNoteEntity>> => {
  const response = await fetch(`${API_URL}/persons/${personId}/notes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create client note");

  return responseBody;
};

export const deletePersonNote = async ({ personId, noteId }: DeletePersonNoteParams) => {
  const response = await fetch(`${API_URL}/persons/${personId}/notes/${noteId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete client note");

  return responseBody;
};

export const getAllGovernorates = async () => {
  const response = await fetch(`${API_URL}/governorates`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch governorates");

  return responseBody;
};

export const createGovernorate = async (payload: GovernorateEntityCreation): Promise<APIResponse<GovernorateEntity>> => {
  const response = await fetch(`${API_URL}/governorates`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create governorate");

  return responseBody;
};

export const updateGovernorate = async ({ id, data, }: UpdateItemType<GovernorateEntityCreation>): Promise<APIResponse<GovernorateEntity>> => {
  const response = await fetch(`${API_URL}/governorates/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update governorate");

  return responseBody;
};

export const deleteGovernorateById = async (id: ID) => {
  const response = await fetch(`${API_URL}/governorates/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete governorate");

  return responseBody;
};

export const getAllCities = async () => {
  const response = await fetch(`${API_URL}/governorates/cities`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch cities");

  return responseBody;
};

export const createCity = async ({ governorateId, data, }: CreateCityParams): Promise<APIResponse<CityEntity>> => {
  const response = await fetch(`${API_URL}/governorates/${governorateId}/cities`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create city");

  return responseBody;
};

export const updateCity = async ({ cityId, data }: UpdateCityParams): Promise<APIResponse<CityEntity>> => {
  const response = await fetch(`${API_URL}/governorates/cities/${cityId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update city");

  return responseBody;
};

export const deleteCity = async ({ cityId }: DeleteCityParams) => {
  const response = await fetch(`${API_URL}/governorates/cities/${cityId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete city");

  return responseBody;
};

export const getAllEmployees = async (params: GetEmployeesParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("l", params.limit.toString());
  if (params.page) queryParams.append("p", params.page.toString());
  if (params.offset) queryParams.append("o", params.offset.toString());
  if (params.search) queryParams.append("s", params.search);

  const response = await fetch(`${API_URL}/employees?${queryParams.toString()}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch employees");

  return responseBody;
};

export const getAllEmployeesIdentifiers = async () => {
  const response = await fetch(`${API_URL}/employees/identifiers`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owners");

  return responseBody;
};

export const getEmployeeById = async (id: ID): Promise<APIResponse<EmployeeEntity>> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch employee");

  return responseBody;
};

export const createEmployee = async (payload: EmployeeEntityCreation): Promise<APIResponse<EmployeeEntity>> => {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create employee");

  return responseBody;
};

export const updateEmployee = async ({ id, data, }: UpdateItemType<EmployeeEntityCreation>): Promise<APIResponse<EmployeeEntity>> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update employee");

  return responseBody;
};

export const deleteEmployeeById = async (id: ID) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete employee");

  return responseBody;
};

export const getAllCategories = async (): Promise<APIResponse<CategoryEntity[]>> => {
  const response = await fetch(`${API_URL}/categories`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch categories");

  return responseBody;
};

export const getCategoryById = async (id: ID): Promise<APIResponse<CategoryEntity>> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch category");

  return responseBody;
};

export const createCategory = async (payload: CategoryENtityCreation): Promise<APIResponse<CategoryEntity>> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create category");

  return responseBody;
};

export const updateCategory = async ({ id, data, }: UpdateItemType<Partial<CategoryENtityCreation>>): Promise<APIResponse<CategoryEntity>> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update category");

  return responseBody;
};

export const deleteCategoryById = async (id: ID) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete category");

  return responseBody;
};

export const getAllOwners = async (params: GetOwnersParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("l", params.limit.toString());
  if (params.page) queryParams.append("p", params.page.toString());
  if (params.offset) queryParams.append("o", params.offset.toString());
  if (params.search) queryParams.append("s", params.search);

  const response = await fetch(`${API_URL}/owners?${queryParams.toString()}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owners");

  return responseBody;
};

export const getAllOwnersIdentifiers = async () => {
  const response = await fetch(`${API_URL}/owners/identifiers`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owners");

  return responseBody;
};

export const getAllOwnerProperties = async (id: ID) => {
  const response = await fetch(`${API_URL}/owners/${id}/properties`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owners");

  return responseBody;
};

export const getOwnerById = async (id: ID): Promise<APIResponse<OwnerEntity>> => {
  const response = await fetch(`${API_URL}/owners/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch owner");

  return responseBody;
};

export const createOwner = async (payload: OwnerEntityCreation): Promise<APIResponse<OwnerEntity>> => {
  const response = await fetch(`${API_URL}/owners`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create owner");

  return responseBody;
};

export const updateOwner = async ({ id, data }: UpdateItemType<OwnerEntityCreation>): Promise<APIResponse<OwnerEntity>> => {
  const response = await fetch(`${API_URL}/owners/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update owner");

  return responseBody;
};

export const assignPropertyToOwner = async ({ ownerId, propertyId }: assignPropertyToOwnerParams): Promise<APIResponse<OwnerPropertyEntity>> => {
  const response = await fetch(`${API_URL}/owners/property/${ownerId}/${propertyId}`, {
    method: "PATCH",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update owner");

  return responseBody;
};

export const deleteOwnerById = async (id: ID) => {
  const response = await fetch(`${API_URL}/owners/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete owner");

  return responseBody;
};

export const unassignPropertyFromOwner = async ({ ownerId, propertyId }: assignPropertyToOwnerParams): Promise<APIResponse<PropertyIdentifiersEntity>> => {
  const response = await fetch(`${API_URL}/owners/property/${ownerId}/${propertyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update owner");

  return responseBody;
};

export const getAllProperties = async (params: GetPropertiesParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("l", params.limit.toString());
  if (params.page) queryParams.append("p", params.page.toString());
  if (params.offset) queryParams.append("o", params.offset.toString());
  if (params.search) queryParams.append("se", params.search);

  if (params.cityId) queryParams.append("ci", params.cityId.toString());
  if (params.categoryId) queryParams.append("ca", params.categoryId.toString());
  if (params.status) queryParams.append("st", params.status);
  if (params.purpose) queryParams.append("pu", params.purpose);
  if (params.minimumPrice !== undefined) queryParams.append("mip", params.minimumPrice.toString());
  if (params.maximumPrice !== undefined) queryParams.append("map", params.maximumPrice.toString());

  const response = await fetch(`${API_URL}/properties?${queryParams.toString()}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch properties");

  return responseBody;
};

export const getUnsignedPropertyIdentifiers = async (): Promise<APIResponse<PropertyIdentifiersEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/unsigned-identifiers`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property");

  return responseBody;
};

export const getPropertyFeatures = async (): Promise<APIResponse<PropertyFeatureEntity[]>> => {
  const response = await fetch(`${API_URL}/property-features`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch client notes");

  return responseBody;
};

export const getPropertyIdentifiers = async (): Promise<APIResponse<PropertyIdentifiersEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/identifiers`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property");

  return responseBody;
};

export const getPropertyById = async (id: ID): Promise<APIResponse<PropertyEntity>> => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property");

  return responseBody;
};

export const getPropertySettingsById = async (id: ID) => {
  const response = await fetch(`${API_URL}/properties/${id}/settings`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property");

  return responseBody;
};

export const createProperty = async (payload: FormData): Promise<APIResponse<PropertyEntity>> => {
  const response = await fetch(`${API_URL}/properties`, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create property");

  return responseBody;
};

export const updateProperty = async ({ id, data, }: UpdateItemWithFormData): Promise<APIResponse<PropertyEntity>> => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data,
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to update property");

  return responseBody;
};

export const deletePropertyById = async (id: ID) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete property");

  return responseBody;
};

export const getPropertyOwner = async (
  propertyId: ID
) => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/owner`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property notes");

  return responseBody;
};

export const getPropertyNotes = async (
  propertyId: ID
): Promise<APIResponse<PropertyNoteEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/notes`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property notes");

  return responseBody;
};

export const createPropertyNote = async ({ propertyId, payload, }: CreatePropertyNoteParams): Promise<APIResponse<PropertyNoteEntity>> => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/notes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to create property note");

  return responseBody;
};

export const deletePropertyNote = async ({ noteId, }: DeletePropertyNoteParams) => {
  const response = await fetch(
    `${API_URL}/properties/notes/${noteId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete property note");

  return responseBody;
};

export const getPropertysFeatures = async (propertyId: ID): Promise<APIResponse<PropertyFeatureEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/features`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property features");

  return responseBody;
};

export const getPropertyImages = async (propertyId: ID): Promise<APIResponse<PropertyImageEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/images`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property images");

  return responseBody;
};

export const deletePropertyImage = async ({ imageId, }: DeletePropertyImageParams) => {
  const response = await fetch(
    `${API_URL}/properties/images/${imageId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete property image");

  return responseBody;
};

export const getPropertyPlans = async (propertyId: ID): Promise<APIResponse<PropertyPlanEntity[]>> => {
  const response = await fetch(`${API_URL}/properties/${propertyId}/plans`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch property images");

  return responseBody;
};

export const deletePropertyPlans = async ({ planId, }: DeletePropertyPlanParams) => {
  const response = await fetch(
    `${API_URL}/properties/plans/${planId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to delete property image");

  return responseBody;
};

// export const getAllPermissions = async (): Promise<APIResponse<PermissionEntity[]>> => {
//   const response = await fetch(`${API_URL}/roles/permissions`, {
//     credentials: "include",
//   });

//   const responseBody = await response.json();

//   if (!response.ok)
//     throw new Error(responseBody.message || "Failed to fetch permissions");

//   return responseBody;
// };

export const getAllRoles = async (): Promise<APIResponse<RoleEntity[]>> => {
  const response = await fetch(`${API_URL}/roles`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok)
    throw new Error(responseBody.message || "Failed to fetch roles");

  return responseBody;
};

// export const getRoleById = async (id: ID): Promise<APIResponse<RoleEntity>> => {
//   const response = await fetch(`${API_URL}/roles/${id}`, {
//     credentials: "include",
//   });

//   const responseBody = await response.json();

//   if (!response.ok)
//     throw new Error(responseBody.message || "Failed to fetch role");

//   return responseBody;
// };

// export const createRole = async (payload: RoleEntityCreation): Promise<APIResponse<RoleEntity>> => {
//   const response = await fetch(`${API_URL}/roles`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const responseBody = await response.json();

//   if (!response.ok)
//     throw new Error(responseBody.message || "Failed to create role");

//   return responseBody;
// };

// export const updateRole = async ({ id, data, }: UpdateItemType<RoleEntityCreation>): Promise<APIResponse<RoleEntity>> => {
//   const response = await fetch(`${API_URL}/roles/${id}`, {
//     method: "PUT",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   const responseBody = await response.json();

//   if (!response.ok)
//     throw new Error(responseBody.message || "Failed to update role");

//   return responseBody;
// };

// export const deleteRoleById = async (id: ID) => {
//   const response = await fetch(`${API_URL}/roles/${id}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   const responseBody = await response.json();

//   if (!response.ok)
//     throw new Error(responseBody.message || "Failed to delete role");

//   return responseBody;
// };