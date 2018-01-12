import getLogger from '../lib/log';
import buildFormObj from '../lib/formObjectBuilder';
import { Task, Tag, User, Creator, TaskStatus, Op } from '../models';

export default (router) => {
  router.get('tasks', '/tasks', async (ctx) => {
    const tasks = await Task.findAll({
      include: [
        { model: User, paranoid: false },
        { association: Creator, paranoid: false },
        { model: TaskStatus, paranoid: false },
        Tag,
      ],
    });

    ctx.render('tasks', { tasks });
  })
  .get('newTask', '/tasks/new', async (ctx) => {
    if (ctx.state.isSignedIn()) {
      const task = Task.build();
      const users = await User.findAll();
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/new', { f: buildFormObj(task), users, statuses });
    } else {
      ctx.flash.set('You should sing IN or sign UP first.');
      ctx.redirect(router.url('root'));
    }
  })
  .post('saveTask', '/tasks', async (ctx) => {
    if (ctx.state.isSignedIn()) {
      const data = ctx.request.body.form;
      let existingTags;
      if (data.tags) {
        const tagNames = data.tags.split(',').map(tag => tag.trim());
        const existingTags = await Tag.findAll({
          where: { name: { [Op.or]: tagNames } },
        });
        const existingTagNames = existingTags.map(tag => tag.name);
        console.log("+++++++++++++++++EXISTING TAGS+++++++++++++++++++++++++++++++++++++");
        console.log(existingTags);
        //data.Tags = tagNames.filter(name => !existingTagNames.includes(name))
          //.map(name => ({ name }));
        console.log("++++++++++++++++NEW TAGS that should be CREATED+++++++++++++++++++++");
        data.Tags = tagNames.map(name => ({ name }));
        console.log(data.Tags);

      }
      data.creator = ctx.session.userId;
      const task = Task.build(data, { include: [Tag] });

      try {
        //await task.save();
        await task.save();
        console.log("++++++++++++++++++TASK BEFORE ADDING EXISTING TAGS+++++++++++++++++++++");
        console.log(task);

        //task.addTags(existingTags);
        //console.log("++++++++++++++++++TASK AFTER ADDIN EXISTING TAGS+++++++++++++++++++++");
        //console.log(task);
        //console.log("++++++++++++++++TASK SAVED+++++++++++++++++++++");
        ctx.flash.set('New task has been created successfully');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        //console.log("++++++++++++++++FROM CATCH+++++++++++++++++++++");
        //console.log("+++++++++++++++++++++NEW TASK: ", newTask);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ERRORS when SAVE TASK: ", e)
        const statuses = await TaskStatus.findAll();
        const users = await User.findAll();
        ctx.render('tasks/new', { f: buildFormObj(task, e), users, statuses });
      }
    } else {
      ctx.flash.set('You should sing IN or sign UP first.');
      ctx.redirect(router.url('root'));
    }
  })
  .get('task', '/task/:taskId', async (ctx) => {
    const { taskId: id } = ctx.params;
    const task = await Task.findById(id, {
      include: [
        { model: User, paranoid: false },
        { association: Creator, paranoid: false },
        { model: TaskStatus, paranoid: false },
        Tag,
      ],
    });
    task.tags = task.Tags.map(tag => tag.name).join(', ');
    const users = await User.findAll({ paranoid: false });
    const statuses = await TaskStatus.findAll();
    ctx.render('tasks/edit', { f: buildFormObj(task), users, statuses });
  })
  .patch('editTask', '/tasks/edit/:taskId', async (ctx) => {
    if (ctx.state.isSignedIn()) {
      const { taskId: id } = ctx.params;
      const data = ctx.request.body.form;
      const task = await Task.findById(id, {
        include: [
          { model: User, paranoid: false },
          { association: Creator, paranoid: false },
          { model: TaskStatus, paranoid: false },
          Tag,
        ],
      });
    try {
        await task.update(data);
        ctx.flash.set('Task updated successfully.');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const users = await User.findAll();
        const statuses = await TaskStatus.findAll();
        ctx.render('tasks/edit', { f: buildFormObj(task, e), users, statuses });
      }
    } else {
      ctx.flash.set('You should sing IN or sign UP first.');
      ctx.redirect(router.url('root'));
    }
  })
  .delete('deleteTask', '/tasks/delete/:taskId', async (ctx) => {
    if (ctx.state.isSignedIn()) {
      const { taskId: id } = ctx.params;
      const task = await Task.findById(id);
      task.destroy();
      ctx.flash.set('Task was deleted');
      ctx.redirect(router.url('tasks'));
    } else {
      ctx.flash.set('You should sing IN or sign UP first.');
      ctx.redirect(router.url('root'));
    }
  });
};
