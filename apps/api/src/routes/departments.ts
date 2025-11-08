import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const departmentsRouter = Router();

// GET /api/departments - List all departments with member counts
departmentsRouter.get('/', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            files: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const result = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      budget: dept.budget ? Number(dept.budget) : null,
      color: dept.color,
      avatar: dept.avatar,
      memberCount: dept._count.users,
      fileCount: dept._count.files,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString(),
    }));

    res.json({ departments: result });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// GET /api/departments/:id - Get single department
departmentsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            files: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
          take: 10,
        },
      },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({
      id: department.id,
      name: department.name,
      description: department.description,
      budget: department.budget ? Number(department.budget) : null,
      color: department.color,
      avatar: department.avatar,
      memberCount: department._count.users,
      fileCount: department._count.files,
      users: department.users,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

// POST /api/departments - Create a new department
departmentsRouter.post('/', async (req, res) => {
  try {
    const { name, description, budget, color, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        color: color || null,
        avatar: avatar || null,
      },
      include: {
        _count: {
          select: {
            users: true,
            files: true,
          },
        },
      },
    });

    res.status(201).json({
      id: department.id,
      name: department.name,
      description: department.description,
      budget: department.budget ? Number(department.budget) : null,
      color: department.color,
      avatar: department.avatar,
      memberCount: department._count.users,
      fileCount: department._count.files,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error creating department:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to create department', details: error.message });
  }
});

// PUT /api/departments/:id - Update a department
departmentsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, budget, color, avatar } = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
        ...(color !== undefined && { color: color || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
      include: {
        _count: {
          select: {
            users: true,
            files: true,
          },
        },
      },
    });

    res.json({
      id: department.id,
      name: department.name,
      description: department.description,
      budget: department.budget ? Number(department.budget) : null,
      color: department.color,
      avatar: department.avatar,
      memberCount: department._count.users,
      fileCount: department._count.files,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating department:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to update department', details: error.message });
  }
});

// DELETE /api/departments/:id - Delete a department
departmentsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id },
    });

    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting department:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(500).json({ error: 'Failed to delete department', details: error.message });
  }
});

