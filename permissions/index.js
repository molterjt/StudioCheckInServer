const { rule, and, shield } = require('graphql-shield');
const { getUserId } = require('../util');

const rules = {
    isAuthenticatedUser: rule()((parent, args, context) => {
        const userId = getUserId(context);
        return Boolean(userId)
    }),
    isPostOwner: rule()(async (parent, { id }, context) => {
        const userId = getUserId(context);
        const author = await context.prisma
            .post({
                id,
            })
            .author();
        return userId === author.id
    }),
    isAdmin: rule()(async (parent, args, context, info) => {
        const userId = getUserId(context);
        const admin = await context.prisma
            .user({
                id: userId
            });
        return admin.position !== 'STUDENT'
    })
}

const permissions = shield({
    Query: {
        me: rules.isAuthenticatedUser,

    },
    Mutation: {
        updateUser: rules.isAuthenticatedUser,
        createAcademy: rules.isAdmin,
        deleteUser: rules.isAdmin,
    },
})


module.exports = {
    permissions,
};