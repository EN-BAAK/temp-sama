import { NextFunction, Response } from "express";
import ErrorHandler, { catchAsyncErrors } from "./error";
import { AuthenticatedRequest, JwtPayload } from "../types/variables";
import settings from "../config/settings";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/users";
import { Person } from "../modules/persons";
import { City } from "../modules/cities";
import { Role } from "../modules/roles";
import { Permission } from "../modules/permissions";

export const verifyAuthentication = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies?.[settings.authCookieName];
    if (!token) {
      return next(new ErrorHandler("Unauthorized: Token not found", 401));
    }

    const payload = verifyToken(token) as JwtPayload
    const user = await User.findByPk(payload.userId, {
      include: [
        {
          model: Person,
          as: "person",
          include: [
            {
              model: City,
              attributes: ["name"],
              as: "city"
            }
          ],
        },
        {
          model: Role,
          attributes: ["id"],
          as: "role",
          include: [
            {
              model: Permission,
              attributes: ["name"],
              as: "permissions"
            }
          ]
        },
        {
          model: Permission,
          attributes: ["name"],
          as: "permissions"
        }
      ]
    })

    if (!user) {
      if (req.cookies?.[settings.authCookieName]) {
        res.clearCookie(settings.authCookieName, {
          httpOnly: true,
          secure: settings.nodeEnvironment === "production",
          sameSite: "strict",
        });
      }
      return next(new ErrorHandler("User not found", 401));
    }

    const json = user.toJSON() as any

    req.id = user.personId;
    req.user = {
      id: user.personId,
      fullName: json.person.fullName,
      email: json.person.email,
      phone: json.person.phone,
      city: json.person.city?.name,
      role: json.role?.permissions?.map((p: any) => p.name) || [],
      permissions: json.permissions?.map((p: any) => p.name) || []
    };

    next();
  }
);