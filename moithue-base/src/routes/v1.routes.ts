import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { adminBlogController } from '../http/controllers/admin.blog.controller';
import { adminContactController } from '../http/controllers/admin.contact.controller';
import { authController } from '../http/controllers/auth.controller';
import { blogController } from '../http/controllers/blog.controller';
import { propertyController } from '../http/controllers/property.controller';
import { publicContactController } from '../http/controllers/public.contact.controller';
import { userController } from '../http/controllers/user.controller';
import { dbContextMiddleware } from '../http/middleware/db-context';
import { loggerMiddleware } from '../http/middleware/logger-context';
import { requestIdMiddleware } from '../http/middleware/request-id';
import { requireAuthMiddleware, optionalAuthMiddleware } from '../http/middleware/auth';
import { requireRoles } from '../http/middleware/rbac';
import { corsMiddleware, securityHeadersMiddleware } from '../http/middleware/security';
import type { AppEnv } from '../types/app';
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
} from '../validation/auth.schemas';
import { paginationQuery, uuidParam } from '../validation/common';
import {
  adminBlogPostCreateSchema,
  adminBlogPostUpdateSchema,
  blogCommentCreateSchema,
  blogCommentsQuerySchema,
  blogListQuerySchema,
  blogPostIdParamSchema,
} from '../validation/blog.schemas';
import {
  contactPagePatchSchema,
  contactSubmissionBodySchema,
  contactSubmissionIdParamSchema,
} from '../validation/contact.schemas';
import {
  propertyCreateBodySchema,
  propertyIdParamSchema,
  propertyListQuerySchema,
  propertyMineQuerySchema,
  propertyUpdateBodySchema,
} from '../validation/property.schemas';
import {
  changePasswordBodySchema,
  createUserBodySchema,
  patchMeBodySchema,
  savedPropertyBodySchema,
  savedPropertyDeleteParamSchema,
  updateUserBodySchema,
} from '../validation/user.schemas';

const userIdParam = z.object({ id: uuidParam });

export function createV1Router() {
  const v1 = new Hono<AppEnv>();

  v1.use('*', requestIdMiddleware);
  v1.use('*', corsMiddleware);
  v1.use('*', securityHeadersMiddleware);
  v1.use('*', loggerMiddleware);
  v1.use('*', dbContextMiddleware);
  v1.use('*', optionalAuthMiddleware);

  v1.get('/', (c) =>
    c.json({
      service: 'moithue-base-api',
      version: 1,
      requestId: c.get('requestId'),
    }),
  );
  v1.get('/health', (c) =>
    c.json({ ok: true, requestId: c.get('requestId') }),
  );

  v1.post(
    '/auth/register',
    zValidator('json', registerBodySchema),
    authController.register,
  );
  v1.post('/auth/login', zValidator('json', loginBodySchema), authController.login);
  v1.post(
    '/auth/refresh',
    zValidator('json', refreshBodySchema),
    authController.refresh,
  );
  v1.post('/auth/logout', zValidator('json', logoutBodySchema), authController.logout);
  v1.post(
    '/auth/forgot-password',
    zValidator('json', forgotPasswordBodySchema),
    authController.forgotPassword,
  );
  v1.post(
    '/auth/reset-password',
    zValidator('json', resetPasswordBodySchema),
    authController.resetPassword,
  );

  const properties = new Hono<AppEnv>();
  properties.get('/', zValidator('query', propertyListQuerySchema), propertyController.search);
  properties.get(
    '/me',
    requireAuthMiddleware,
    zValidator('query', propertyMineQuerySchema),
    propertyController.mine,
  );
  properties.post(
    '/',
    requireAuthMiddleware,
    requireRoles('admin'),
    zValidator('json', propertyCreateBodySchema),
    propertyController.create,
  );
  properties.get(
    '/:id/similar',
    zValidator('param', propertyIdParamSchema),
    propertyController.similar,
  );
  properties.get('/:id', zValidator('param', propertyIdParamSchema), propertyController.getById);
  properties.patch(
    '/:id',
    requireAuthMiddleware,
    zValidator('param', propertyIdParamSchema),
    zValidator('json', propertyUpdateBodySchema),
    propertyController.update,
  );
  properties.delete(
    '/:id',
    requireAuthMiddleware,
    zValidator('param', propertyIdParamSchema),
    propertyController.remove,
  );
  v1.route('/properties', properties);

  const blog = new Hono<AppEnv>();
  blog.get('/posts', zValidator('query', blogListQuerySchema), blogController.listPosts);
  blog.get('/posts/:id', zValidator('param', blogPostIdParamSchema), blogController.getPost);
  blog.get(
    '/posts/:id/comments',
    zValidator('param', blogPostIdParamSchema),
    zValidator('query', blogCommentsQuerySchema),
    blogController.listComments,
  );
  blog.post(
    '/posts/:id/comments',
    requireAuthMiddleware,
    zValidator('param', blogPostIdParamSchema),
    zValidator('json', blogCommentCreateSchema),
    blogController.createComment,
  );
  v1.route('/blog', blog);

  v1.get('/public/contact', publicContactController.getPage);
  v1.post(
    '/public/contact/submissions',
    zValidator('json', contactSubmissionBodySchema),
    publicContactController.submit,
  );

  const admin = new Hono<AppEnv>();
  admin.use('*', requireAuthMiddleware);
  admin.use('*', requireRoles('admin'));
  admin.get('/contact', adminContactController.getPage);
  admin.patch('/contact', zValidator('json', contactPagePatchSchema), adminContactController.patchPage);
  admin.get(
    '/contact/submissions',
    zValidator('query', paginationQuery),
    adminContactController.listSubmissions,
  );
  admin.delete(
    '/contact/submissions/:id',
    zValidator('param', contactSubmissionIdParamSchema),
    adminContactController.deleteSubmission,
  );
  admin.get('/blog/posts', zValidator('query', paginationQuery), adminBlogController.list);
  admin.get('/blog/posts/:id', zValidator('param', blogPostIdParamSchema), adminBlogController.getOne);
  admin.post('/blog/posts', zValidator('json', adminBlogPostCreateSchema), adminBlogController.create);
  admin.patch(
    '/blog/posts/:id',
    zValidator('param', blogPostIdParamSchema),
    zValidator('json', adminBlogPostUpdateSchema),
    adminBlogController.update,
  );
  admin.delete('/blog/posts/:id', zValidator('param', blogPostIdParamSchema), adminBlogController.remove);
  v1.route('/admin', admin);

  const users = new Hono<AppEnv>();
  users.use('*', requireAuthMiddleware);
  users.get('/me', userController.me);
  users.patch('/me', zValidator('json', patchMeBodySchema), userController.patchMe);
  users.post(
    '/me/password',
    zValidator('json', changePasswordBodySchema),
    userController.changePassword,
  );
  users.get(
    '/me/saved-properties',
    zValidator('query', paginationQuery),
    userController.listSavedProperties,
  );
  users.delete('/me/saved-properties', userController.clearAllSavedProperties);
  users.post(
    '/me/saved-properties',
    zValidator('json', savedPropertyBodySchema),
    userController.addSavedProperty,
  );
  users.delete(
    '/me/saved-properties/:propertyId',
    zValidator('param', savedPropertyDeleteParamSchema),
    userController.removeSavedProperty,
  );
  users.get(
    '/',
    requireRoles('admin'),
    zValidator('query', paginationQuery),
    userController.list,
  );
  users.post(
    '/',
    requireRoles('admin'),
    zValidator('json', createUserBodySchema),
    userController.create,
  );
  users.get('/:id', zValidator('param', userIdParam), userController.getById);
  users.patch(
    '/:id',
    zValidator('param', userIdParam),
    zValidator('json', updateUserBodySchema),
    userController.update,
  );
  users.delete(
    '/:id',
    requireRoles('admin'),
    zValidator('param', userIdParam),
    userController.delete,
  );

  v1.route('/users', users);

  return v1;
}
