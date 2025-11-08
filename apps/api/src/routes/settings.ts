import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const settingsRouter = Router();

// GET /api/settings - Get all settings or by category
settingsRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: {
        category: 'asc',
      },
    });

    // Parse JSON values
    const result = settings.map((setting) => ({
      id: setting.id,
      key: setting.key,
      value: tryParseJSON(setting.value),
      category: setting.category,
      description: setting.description,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    }));

    res.json({ settings: result });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/settings/:key - Get a specific setting
settingsRouter.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({
      id: setting.id,
      key: setting.key,
      value: tryParseJSON(setting.value),
      category: setting.category,
      description: setting.description,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// POST /api/settings - Create or update a setting
settingsRouter.post('/', async (req, res) => {
  try {
    const { key, value, category = 'general', description, updatedBy } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const valueString = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: valueString,
        category,
        description: description || null,
        updatedBy: updatedBy || null,
      },
      create: {
        key,
        value: valueString,
        category,
        description: description || null,
        updatedBy: updatedBy || null,
      },
    });

    res.json({
      id: setting.id,
      key: setting.key,
      value: tryParseJSON(setting.value),
      category: setting.category,
      description: setting.description,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    });
  } catch (error: any) {
    console.error('Error saving setting:', error);
    res.status(500).json({ error: 'Failed to save setting', details: error.message });
  }
});

// PUT /api/settings/:key - Update a setting
settingsRouter.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value, category, description, updatedBy } = req.body;

    const valueString = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.setting.update({
      where: { key },
      data: {
        value: valueString,
        ...(category && { category }),
        ...(description !== undefined && { description: description || null }),
        ...(updatedBy && { updatedBy }),
      },
    });

    res.json({
      id: setting.id,
      key: setting.key,
      value: tryParseJSON(setting.value),
      category: setting.category,
      description: setting.description,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    });
  } catch (error: any) {
    console.error('Error updating setting:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.status(500).json({ error: 'Failed to update setting', details: error.message });
  }
});

// DELETE /api/settings/:key - Delete a setting
settingsRouter.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    await prisma.setting.delete({
      where: { key },
    });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting setting:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.status(500).json({ error: 'Failed to delete setting', details: error.message });
  }
});

// Helper function to parse JSON values
function tryParseJSON(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

