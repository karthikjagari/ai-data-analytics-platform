import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const chatHistoryRouter = Router();

// GET /api/chat-history/:sessionId - Get chat history for a session
chatHistoryRouter.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;

    const where: any = { sessionId };
    if (userId) {
      where.userId = userId as string;
    }

    const messages = await prisma.chatHistory.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    const formatted = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      sql: msg.sql || undefined,
      data: msg.data ? JSON.parse(msg.data) : undefined,
      explanation: msg.explanation || undefined,
      createdAt: msg.createdAt.toISOString(),
    }));

    res.json({ messages: formatted });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// POST /api/chat-history - Save a message to chat history
chatHistoryRouter.post('/', async (req, res) => {
  try {
    const { sessionId, userId, role, content, sql, data, explanation } = req.body;

    if (!sessionId || !role || !content) {
      return res.status(400).json({ error: 'sessionId, role, and content are required' });
    }

    const message = await prisma.chatHistory.create({
      data: {
        sessionId,
        userId: userId || null,
        role,
        content,
        sql: sql || null,
        data: data ? JSON.stringify(data) : null,
        explanation: explanation || null,
      },
    });

    res.json({
      id: message.id,
      sessionId: message.sessionId,
      role: message.role,
      content: message.content,
      sql: message.sql,
      data: message.data ? JSON.parse(message.data) : null,
      explanation: message.explanation,
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Failed to save chat history' });
  }
});

// DELETE /api/chat-history/:sessionId - Delete chat history for a session
chatHistoryRouter.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    await prisma.chatHistory.deleteMany({
      where: { sessionId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

// GET /api/chat-history - List all sessions
chatHistoryRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    const where: any = {};
    if (userId) {
      where.userId = userId as string;
    }

    // Get unique sessions with latest message
    const sessions = await prisma.chatHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      distinct: ['sessionId'],
      select: {
        sessionId: true,
        createdAt: true,
        content: true,
      },
    });

    // Get message counts per session
    const sessionIds = sessions.map((s) => s.sessionId);
    const counts = await prisma.chatHistory.groupBy({
      by: ['sessionId'],
      where: {
        sessionId: { in: sessionIds },
      },
      _count: true,
    });

    const countMap = new Map(counts.map((c) => [c.sessionId, c._count]));

    const result = sessions.map((session) => ({
      sessionId: session.sessionId,
      lastMessage: session.content.substring(0, 100),
      messageCount: countMap.get(session.sessionId) || 0,
      lastActivity: session.createdAt.toISOString(),
    }));

    res.json({ sessions: result });
  } catch (error) {
    console.error('Error listing chat sessions:', error);
    res.status(500).json({ error: 'Failed to list chat sessions' });
  }
});

