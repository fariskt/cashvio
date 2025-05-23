import {   Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { isAuthenticate } from "../middleware/verifyToken";
import { createExpenses, deleteExpense, deleteSelectedExpenses, getUserExpenses, updateExpense } from "../controller/expenseController";

const expenseRoute = Router();

expenseRoute.get("/", isAuthenticate , asyncHandler(getUserExpenses))
expenseRoute.post("/create", isAuthenticate, asyncHandler(createExpenses))
expenseRoute.put("/update/:expenseId", isAuthenticate, asyncHandler(updateExpense))
expenseRoute.delete("/deleteMany", isAuthenticate, asyncHandler(deleteSelectedExpenses))
expenseRoute.delete("/delete/:expenseId", isAuthenticate, asyncHandler(deleteExpense))

export default expenseRoute;
