import ErrorHandler from "../middlewares/error";
import { City } from "../modules/cities";
import { Employee } from "../modules/employees";
import { Person } from "../modules/persons";
import { Permission } from "../modules/permissions";
import { Role } from "../modules/roles";
import { User } from "../modules/users";
import { findEmployeeByIdProps } from "../types/strategies";

export const formatEmployeeResponse = (employeeInstance: Employee) => {
  const emp = employeeInstance.toJSON() as any
  const person = emp.person || {}
  const user = person.user || {}

  return {
    id: emp.personId,
    fullName: person.fullName || null,
    email: person.email || null,
    phone: person.phone || null,
    city: person.city || null,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
    role: user.role?.name || null,
    permissions: user.permissions || [],
  };
};

export const findEmployeeById = async ({ id, relational = false, transaction }: findEmployeeByIdProps) => {
  const includes = relational ? [
    {
      model: Person,
      as: "person",
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          include: [
            {
              model: Role,
              as: "role",
              include: [{ model: Permission, as: "permissions" }],
            },
            {
              model: Permission,
              as: "permissions",
            },
          ],
        }
      ],
    },
  ] : undefined

  const employee = await Employee.findByPk(id, {
    include: includes,
    transaction
  });

  if (!employee) {
    throw new ErrorHandler("Employee not found", 404);
  }

  return relational ? formatEmployeeResponse(employee) : employee;
}