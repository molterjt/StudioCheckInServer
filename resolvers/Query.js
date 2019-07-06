const { prisma } = require('../generated/prisma-client');
const { getUserId } = require('../util');
const moment = require('moment');



const Query = {
    me: (parent, args, context) => {
        const userId = getUserId(context);
        return context.prisma.user({
            id: userId,
        });
    },
    users(root, args, context){
        return context.prisma
            .users({
                orderBy: "firstName_ASC"
            })
    },
    user(root, args, context){
        return context.prisma
            .user({id: args.userId})
    },
    userCheckInHistory(root, args, context){
        const userId = getUserId(context);
        return context.prisma
            .user({id: userId}).checkIns()
    },
    searchUserByName(root, args, context){
        return context.prisma.users({
            where:{
                firstName_contains: args.searchString
            }
        })
    },
    instructors(root, args, context){
        return context.prisma.instructors({})
    },
    instructor(root, {id}, context){
        return context.prisma.instructors({id})
    },
    academies(root, args, context){
        return context.prisma.academies({})
    },
    academy(root, args, context){
        return context.prisma.academy({id: args.academyId})
    },
    academyRoster(root, args, context){
        return context.prisma.users({
            where: {
                academies_some:{
                    title: args.academyTitle
                }
            }
        })
    },
    classPeriods(root, args, context){
        return context.prisma.classPeriods({
            orderBy: "stamp_ASC"
        })
    },
    classPeriod(root,args,context) {
        return context.prisma.classPeriod({id: args.classPeriodId})
    },
    classPeriodsToday(root, args, context){
        const today = new Date();
        const myTime = new Date().toLocaleTimeString();
        console.log('myTime: ', myTime);
        const weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        const day = weekday[today.getDay()];
        return context.prisma.classPeriods({
            where:{
                day: (args.daySearch ? args.daySearch : day),
                academy:{
                    title: args.academyTitle
                },
            },
            orderBy: "stamp_ASC",
        })
    },
    classPeriodsTodayWithTime(root, args, context){
        const today = new Date();
        const myTime = new Date().toLocaleTimeString();
        console.log('myTime: ', myTime);
        const weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        const day = weekday[today.getDay()];
        return context.prisma.classPeriods({
            where:{
                day: (args.daySearch ? args.daySearch : day),
                academy:{
                    title: args.academyTitle
                },
                time: (args.timeSearch ? args.timeSearch : myTime)
            },
        })
    },
    classPeriodsByAcademy(root,args,context){
        return context.prisma.classPeriods({
            where:{
                academy:{
                    title: args.academyTitle
                },
            }
        })
    },
    techniques(root, args, context){
        return context.prisma.techniques({
            orderBy: "title_ASC",
            where: {
                title_contains: args.techSearch
            }
        })
    },
    technique(root, args, context){
        return context.prisma.technique({id: args.techniqueId})
    },
    checkIns(root, args, context){
        return context.prisma.checkIns({})
    },
    checkInsByUserAndClassSession(root, args, context){
        return context.prisma.checkIns({
            where: {
                user: {
                    id: args.userId
                },
                AND: {
                    classSession: {
                        title: args.classSessionTitle
                    }
                }
            }
        })
    },
    checkIn(root, args, context){
        return context.prisma.checkIn({id: args.checkinId})
    },
    checkInsFiveMostRecentByUser(root, args, context){
        return context.prisma.checkIns({
            where:{
                user: {
                    id: args.userId
                }
            },
            orderBy: "createdAt_DESC",
            first: 5,
        })
    },

    tags(root, args, context){
        return context.prisma.tags({
            where:{
                name_contains: args.tagSearch,
            },
            orderBy: "name_ASC",
        })
    },
    tag(root, args, context){
        return context.prisma.tag({id: args.tagId})
    },
    classSessions(root, args, context){
        return context.prisma.classSessions({})
    },
    classSession(root, args, context){
        return context.prisma.classSession({id: args.classSessionId})
    },
    classSessionsWhereClassPeriod(root, args, context){
        const today = new Date().toDateString();
        const titleSelector = today.concat("__", args.classPeriodId);
        return context.prisma.classSessions({
            where:{
                title: titleSelector
            }
        })
    },
    classSessionsByAcademy(root, args, context){
        return context.prisma.classSessions({
            where:{
                academy: {title: args.academyTitle}
            },
            orderBy: "date_DESC",
            first: args.first,
            skip: args.skip,
        })
    },
    beltPromotions(root, args, context){
        return context.prisma.beltPromotions({})
    },
    beltPromotion(root, args, context){
        return context.prisma.technique({id: args.beltPromotionId})
    },
    events(root, args, context){
        return context.prisma.events({})
    },
    event(root, args, context){
        return context.prisma.event({id: args.eventId})
    },


};

module.exports = {
    Query,
}