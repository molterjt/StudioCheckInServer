
const { Query } = require('./Query');
const { Mutation } = require('./Mutation');

module.exports = {
    Query,
    Mutation,
    User: {
        academies(root, args, context) {
            return context.prisma
                .user({id: root.id})
                .academies()
        },
        beltPromotions(root, args, context) {
            return context.prisma
                .user({id: root.id})
                .beltPromotions()
        },
        checkIns(root, args, context){
            return context.prisma
                .user({id: root.id})
                .checkIns()
        },

    },
    BeltPromotion: {
        user(root, args, context) {
            return context.prisma
                .beltPromotion({id: root.id})
                .user()
        }
    },
    Academy: {
        users(root, args, context) {
            return context.prisma
                .academy({id: root.id})
                .users()
        },
        classPeriods(root, args, context){
            return context.prisma
                .academy({id:root.id})
                .classPeriods()
        }
    },
    Instructor: {
        user(root, args, context) {
            return context.prisma
                .instructor({id: root.id})
                .user()
        }
    },
    ClassSession: {
        academy(root, args, context) {
            return context.prisma
                .classSession({id: root.id})
                .academy()
        },
        instructor(root, args, context) {
            return context.prisma
                .classSession({id: root.id})
                .instructor()
        },
        techniques(root, args, context) {
            return context.prisma
                .classSession({id: root.id})
                .techniques()
        },
        checkIns(root, args, context) {
            return context.prisma
                .classSession({id: root.id})
                .checkIns()
        },
        classPeriod(root, args, context){
            return context.prisma
                .classSession({id: root.id})
                .classPeriod()
        }
    },
    ClassPeriod:{
        classSessions(root,args,context){
            return context.prisma
                .classPeriod({
                    id: root.id
                })
                .classSessions()
        },
        academy(root,args,context){
            return context.prisma
                .classPeriod({
                    id: root.id
                })
                .academy()
        },
        instructor(root, args, context){
            return context.prisma
                .classPeriod({
                    id: root.id
                })
                .instructor()
        }
    },
    CheckIn: {
        classSession(root, args, context) {
            return context.prisma
                .checkIn({id: root.id})
                .classSession()
        },
        user(root, args, context) {
            return context.prisma
                .checkIn({id: root.id})
                .user()
        },
        event(root,args,context){
            return context.prisma
                .checkIn({id: rood.id})
                .event()
        }
    },
    Event:{
        checkIns(root, args, context){
            return context.prisma
                .event({id: root.id})
                .checkIns()
        }
    },
    Technique: {
        tags(root, args, context){
            return context.prisma
                .technique({
                    id: root.id
                })
                .tags()
        },
    },
    Tag: {
        technique(root, args, context) {
            return context.prisma
                .tag({
                    id: root.id
                })
                .technique()
        }
    },
};