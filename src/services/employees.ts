import { Op } from "sequelize";
import { Employee } from "../modules/employees";
import { Person } from "../modules/persons";
import { User } from "../modules/users";
import { Role } from "../modules/roles";
import db from "../modules";
import { ID } from "../types/variables";
import { getAllUEmployeesProps } from "../types/services";
import { createUser, updateUser } from "./users";
import { createPerson, updatePerson, deletePersonById } from "./persons";
import { findEmployeeById, formatEmployeeResponse } from "../strategies/employees";
import { Permission } from "../modules/permissions";
import ErrorHandler from "../middlewares/error";

export const getAllEmployees = async (query: getAllUEmployeesProps) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offsetUnit = Number(query.offset) || 0
  const offset = (page - 1) * limit + offsetUnit;
  const search = query.search
  const userId = query.userId

  const personWhereClause: any = {};

  if (search) {
    personWhereClause[Op.or] = [
      { fullName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Employee.findAndCountAll({
    limit,
    offset,
    distinct: true,
    subQuery: false,
    include: [
      {
        model: Person,
        as: "person",
        where: { id: { [Op.ne]: userId } },
        include: [
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
          },
        ],
      },
    ],
    order: [[{ model: Person, as: "person" }, "createdAt", "DESC"]],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    items: rows.map((emp) => formatEmployeeResponse(emp)),
    page,
    limit,
    total: count,
    totalPages,
    nextPage: page < totalPages ? page + 1 : false,
    prevPage: page > 1 ? page - 1 : false,
  };
};

export const getEmployeeById = async (id: ID) => {
  const employee = await findEmployeeById({
    id,
    relational: true
  })

  return employee
};

export const getAllEmployeesIdentifiers = async () => {
  const employees = await Employee.findAll({
    attributes: [],
    include: {
      model: Person,
      as: "person",
      attributes: ["id", "fullName", "phone"]
    }
  })

  const json = employees.map(o => {
    const employee = o.toJSON() as any
    return {
      id: employee.person.id,
      fullName: employee.person.fullName,
      phone: employee.person.phone
    }
  })

  return json
};

export const createEmployee = async (data: any) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const person = await createPerson(
      {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        cityId: data.cityId || null,
      },
      { transaction: t }
    );

    const employee = await Employee.create(
      {
        personId: person.id,
      },
      { transaction: t }
    );

    await createUser(
      {
        personId: person.id,
        password: data.password,
        roleId: data.roleId,
        permissionIds: data.permissionIds,
      },
      { transaction: t }
    );

    const result = await findEmployeeById({
      id: employee.personId,
      relational: true,
      transaction: t
    });

    await t.commit();

    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateEmployee = async (id: ID, data: any) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const employee = await findEmployeeById({
      id,
      transaction: t
    }) as Employee

    await updatePerson(
      employee.personId,
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cityId: data.cityId,
      },
      { transaction: t }
    );

    const user = await User.findOne({
      where: {
        personId: employee.personId,
      },
      transaction: t
    });

    if (user) {
      await updateUser(
        user.personId,
        {
          password: data.password,
          roleId: data.roleId,
          permissionIds: data.permissionIds,
        },
        { transaction: t }
      );
    }

    const result = await findEmployeeById({
      id: employee.personId,
      relational: true,
      transaction: t
    });

    await t.commit();

    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteEmployeeById = async (id: ID) => {
  const employee = await Employee.findByPk(id, {
    include: [
      {
        model: Person,
        as: "person",
        include: [
          {
            model: User,
            as: "user",
            include: [
              {
                model: Role,
                as: "role",
              },
            ],
          },
        ],
      },
    ],
  }) as any

  if (!employee) {
    throw new ErrorHandler("Employee not found", 404);
  }

  const role = employee.person?.user?.role

  if (role?.name === "مدير") {
    throw new ErrorHandler("Manager employee cannot be deleted", 400);
  }

  return await deletePersonById(employee.personId);
};