const { prisma } = require('../generated/prisma-client');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../util');


const Mutation = {

    /*** Registration  ***/

    signup: async (parent, args, context) => {
        const hashedPassword = await hash(args.password, 10);
        const user = await context.prisma.createUser({
            ...args,
            password: hashedPassword,
        });
        return {
            token: jwt.sign({ userId: user.id }, APP_SECRET),
            user,
        }
    },
    login: async (parent, { email, password }, context) => {
        const user = await context.prisma.user({ email });
        if (!user) {
            throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
            throw new Error('Invalid password')
        }
        return {
            token: jwt.sign({ userId: user.id }, APP_SECRET),
            user,
        }
    },

    /*** User  ***/
    createUser: async (root, args, context) => {
        const {academies} = args;
        const hashedPassword = await hash(args.password, 10);
        const user = await context.prisma.createUser({
            firstName: args.firstName,
            lastName: args.lastName,
            password: hashedPassword,
            email: args.email,
            phone: args.phone,
            dob: args.dob,
            position: args.position,
            joinDate: args.joinDate,
            beltColor: args.beltColor,
            stripeCount: args.stripeCount,
            academies:{
                connect: academies.map((location) => ({
                    id: location
                }))
            }
        });
        return {
            token: jwt.sign({ userId: user.id }, APP_SECRET),
            user,
        }
    },
    updateUser(root, args, context){
        const {academies} = args;
        return context.prisma.updateUser({
            data:{
                firstName: args.firstName,
                lastName: args.lastName,
                password: args.password,
                email: args.email,
                phone: args.phone,
                dob: args.dob,
                position: args.position,
                joinDate: args.joinDate,
                beltColor: args.beltColor,
                stripeCount: args.stripeCount,
                academies:{
                    connect: academies.map((location) => ({
                        id: location
                    }))
                }
            },

            where: {
                id: args.userId
            }
        })
    },
    deleteUser(root, args, context){
        return context.prisma.deleteUser({id: args.userId})
    },

    createAcademy(root, args, context){
        return context.prisma.createAcademy({
            title: args.title,
        })
    },
    updateAcademy(root, args, context){
        const {users, classSessions} = args;
        return context.prisma.updateAcademy({
            data:{
                title: args.title,
                classes: classSessions ? {
                    connect: classSessions.map((classId) => ({id: classId}))
                } : null,
                users: users ? {
                    connect: users.map((user) => ({id: user}))

                } : null,
            },
            where:{
                id: args.academyId
            }
        })
    },
    deleteAcademy(root, args, context){
        return context.prisma.deleteAcademy({id: args.academyId})
    },
    /*** Instructor  ***/
    createInstructor(root, args, context){
        return context.prisma.createInstructor({
            user:{
                connect:{
                    id: args.userId
                }
            }
        })
    },
    updateInstructor(root, args, context){
        return context.prisma.updateInstructor({
            data:{
                bio: args.bio,
                lineage: args.lineage,
                photo: args.photo,
            },
            where: {
                id: args.instructorId
            }
        })
    },
    deleteInstructor(root, {id}, context){
        return context.prisma.deleteInstructor({id})
    },
    /*** Technique  ***/

    createTechniqueWithExistingTags(root, args, context){
        const {tagIds} = args;
        return context.prisma.createTechnique({
            title: args.title,
            tags:{
                connect: tagIds.map((tag) => ({
                    id: tag
                }))
            }
        })
    },
    createTechniqueWithNewTags(root, args, context){
        const {tags} = args;
        return context.prisma.createTechnique({
            title: args.title,
            tags:{
                create: tags.map((tag) => ({
                    name: tag
                }))
            }
        })
    },
    deleteTechnique(root, args, context){
        return context.prisma.deleteTechnique({id: args.techniqueId})
    },
    updateTechnique(root, args, context){
        const {tagIds} = args;
        return context.prisma.updateTechnique({
            data:{
                title: args.title,
                tags: {
                    connect: tagIds.map((tag) => ({
                        id: tag
                    }))
                }

            },
            where: {id: args.techniqueId}
        })
    },

    /*** Tags  ***/
    createTag(root, args, context) {
        const {tag} = args;
        return context.prisma
            .createTag({
                name: args.name,
                technique: {
                    connect: {id: args.techniqueId}
                }
            })
    },
    deleteTag(root, args, context){
        return context.prisma.deleteTag({id: args.tagId})
    },
    deleteTagsOfTechnique(root,args,context){
        return context.prisma.deleteManyTags({
            technique: {id: args.techniqueId}
        })
    },
    deleteTags(root, args, context){
        const {tagIds} = args;
        return context.prisma.deleteManyTags({
            id_in: args.tagIds

        }).count()
    },
    updateTag(root, args, context){
        return context.prisma
            .updateTag({
                data: {
                    name: args.name
                },
                where: {id: args.tagId}
            })
    },

    /*** CheckIn  ***/
    createCheckIn(root, args, context){
        return context.prisma.createCheckIn({
            checked: args.checked,
            user: {
                connect: {id: args.userId},
            },
            classSession: {
                connect: {title: args.classSessionTitle}
            },
            event: args.eventId ? {
                connect:{id: args.eventId}
            } : null
        })
    },
    deleteCheckIn(root, args, context){
        return context.prisma.deleteCheckIn({id: args.checkInId})
    },
    updateCheckIn(root, args, context){
        return context.prisma
            .updateCheckIn({
                data:{
                    checked: args.checked,
                    classSession: {
                        connect: {id:  args.classSessionId}
                    },
                    event: {
                        connect:{id: args.eventId}
                    },

                },
                where: {id: args.checkInId}
            })
    },
    /*** ClassPeriod  ***/
    createClassPeriod(root, args, context){
        return context.prisma.createClassPeriod({
            day: args.day,
            time: args.time,
            stamp: args.stamp,
            title: args.title,
            instructor: {
                connect: {id: args.instructorId}
            },
            academy: {
                connect: {id: args.academyId}
            }
        })
    },
    updateClassPeriod(root, args, context){
        return context.prisma.updateClassPeriod({
            data:{
                day: args.day,
                time: args.time,
                title: args.title,
                stamp: args.stamp,

                instructor: args.instructorId ? {
                    connect: {id: args.instructorId}
                } : null,
                academy: args.academyId ? {
                    connect: {id: args.academyId}
                } : null,
                classSessions: args.classSessionIds ? {connect: args.classSessionIds.map((obj) => ({id: obj}))} : null
            },
            where:{
                id: args.classPeriodId
            }

        })
    },
    deleteClassPeriod(root, args, context){
        return context.prisma.deleteClassPeriod({
            id: args.classPeriodId
        })
    },
    /*** ClassSession  ***/
    createClassSession(root, args, context){
        const today =  new Date().toDateString();
        return context.prisma.createClassSession({
            title: today.concat("__", args.classPeriodId) ,
            academy: {
                connect: {id: args.academyId}
            },
            classPeriod: {
              connect: {id: args.classPeriodId}
            },
            techniques: {
                connect: args.techniqueIds.map((tech) => ({
                    id: tech
                }))
            },
            instructor: {
                connect:{id: args.instructorId}
            },
            date: today
        });
    },
    deleteClassSession(root, args, context){
        return context.prisma.deleteClassSession({id: args.classSessionId})

    },
    updateClassSession(root, args, context){
        return context.prisma
            .updateClassSession({
                where: {id: args.classSessionId},
                data: {
                    academy: {
                        connect: {id: args.academyId}
                    },
                    techniques: {
                        connect: args.techniqueIds.map((tech) => ({
                            id: tech
                        }))
                    },
                    classPeriod: {
                        connect: {id: args.classPeriodId}
                    },
                    instructor: {
                        connect:{id: args.instructorId}
                    },
                    date: args.date,
                    checkIns: {
                        create: args.checkInValues.map((obj) => ({
                            user: {
                                connect:{id: obj.userId}
                            },
                            checked: obj.checked
                        }))
                    }
                }
            })
    },

    updateOrCreateClassSession(root,args, context){
        const today = new Date().toDateString();
        const titleSelector = today.concat("__", args.classPeriodId);
        return context.prisma
          .upsertClassSession({
              where: {
                  title: args.title ? args.title : titleSelector
              },
              update:{
                  academy: {
                      connect: {id: args.academyId}
                  },
                  techniques: args.techniqueIds ? { connect: args.techniqueIds.map( (tech) => ( {id: tech} ) ) } : null,
                  instructor: {
                      connect:{id: args.instructorId}
                  },
                  date: args.date,
                  checkIns: args.checkInValues ? {create: args.checkInValues.map( (obj) => ( {user: { connect:{id: obj.userId} }, checked: obj.checked} ) ) } : null,

              },

              create: {
                  title: titleSelector,
                  academy: {
                      connect: {id: args.academyId}
                  },
                  techniques: args.techniqueIds ? { connect: args.techniqueIds.map( (tech) => ( {id: tech} ) ) } : null,
                  classPeriod: {
                      connect: {id: args.classPeriodId}
                  },
                  instructor: {
                      connect:{id: args.instructorId}
                  },
                  date:  new Date().toDateString(),
                  checkIns: args.checkInValues ? {create: args.checkInValues.map( (obj) => ( {user: { connect:{id: obj.userId} }, checked: obj.checked} ) ) } : null,
              }
          })
    },
    /*** BeltPromotion  ***/
    createBeltPromotion(root, args, context){
        return context.prisma
            .createBeltPromotion({
                category: args.category,
                note: args.note,
                date: new Date(),
                user:{
                    connect: {id:  args.userId}
                }
            })
    },
    deleteBeltPromotion(root, args, context){
        return context.prisma
            .beltPromotion({id: args.beltPromotionId})
    },
    updateBeltPromotion(root, args, context){
        return context.prisma
            .updateBeltPromotion({
                data:{
                    category: args.category,
                    note: args.note,
                    date: args.date,
                },
                where:{id: args.beltPromotionId}
            })
    },
    /*** Event  ***/
    createEvent(root, args, context){
        return context.prisma
            .createEvent({
                title: args.title,
                eventImage: args.eventImage,
                day:  args.day,
                time:  args.time,
                date:  args.date,
                type:  args.type,
                price:  args.price,
                location:  args.location,
                note:  args.note,
                publish:  args.publish,
            })
    },
    deleteEvent(root, args, context){
        return context.prisma
            .event({id: args.eventId})
    },
    updateEvent(root, args, context){
        return context.prisma
            .updateBeltPromotion({
                data:{
                    title: args.title,
                    eventImage: args.eventImage,
                    day:  args.day,
                    time:  args.time,
                    date:  args.date,
                    type:  args.type,
                    price:  args.price,
                    location:  args.location,
                    note:  args.note,
                    checkIns: {
                        connect: checkInIds.map((obj) => ({
                            id: obj
                        }))
                    }
                },
                where:{id: args.eventId}
            })
    },
    // createDraft: async (parent, { title, content }, context) => {
    //     const userId = getUserId(context);
    //     return context.prisma.createPost({
    //         title,
    //         content,
    //         author: { connect: { id: userId } },
    //     })
    // },
};

module.exports = {
    Mutation,
};