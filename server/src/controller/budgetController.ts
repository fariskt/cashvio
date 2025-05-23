import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/db";

export const getUserBudgets = async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const budgets = await prisma.budget.findMany({ where: { userId } });
  if (!budgets) {
    return res.status(404).json({ message: "Budgets not found" });
  }
  return res
    .status(200)
    .json({ message: "Budgets fetched successfully", budgets });
};

export const createBudgets = async (req: Request, res: Response) => {
  const budgetBody = req.body;

  const { userId } = (req as AuthRequest).user;
  const existingBudget = await prisma.budget.findUnique({
    where: {
      userId_category_startDate: {
        userId,
        category: budgetBody.category,
        startDate: new Date(budgetBody.startDate),
      },
    },
  });

  if (existingBudget) {
    return res.status(400).json({
      message: "A budget for this category and start date already exists",
    });
  }

  const newBudget = await prisma.budget.create({
    data: {
      userId,
      ...budgetBody,
    },
  });

  return res
    .status(201)
    .json({ message: "Budget created succesfully", data: newBudget });
};

export const deleteBudget = async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  if (!budgetId) {
    return res.status(404).json({ message: "Budget not found" });
  }
  await prisma.budget.delete({ where: { id: budgetId } });
  return res.status(201).json({ message: "Budget deleted successfully" });
};

export const updateBudget = async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  if (!budgetId) {
    return res.status(404).json({ message: "Budget not found" });
  }
  const { category, limit, period, startDate, endDate } = req.body;

  const existingBudget = await prisma.budget.findUnique({
    where: { id: budgetId },
  });

  if (!existingBudget) {
    return res.status(404).json({ message: "Budget not found" });
  }

  const updatedBudget = await prisma.budget.update({
    where: { id: budgetId },
    data: {
      category,
      limit,
      period,
      startDate,
      endDate,
    },
  });

  return res.status(200).json({
    message: "Budget updated successfully",
    expense: updatedBudget,
  });
};


export const deleteSelectedBudget = async (req: Request, res: Response) => {
  const budgetIds  = req.body;
  if (!budgetIds || budgetIds.length === 0) {
    return res.status(404).json({ message: "Please Provide Budgets to delete" });
  }
  const selectedIdToDelete = await prisma.budget.deleteMany({
    where: { id: { in: budgetIds } },
  });
  return res.status(200).json({
    message: "Selected budget deleted!",
    count: selectedIdToDelete.count,
  });
};
