import request from 'supertest'
import server from '../app/index'
import Card from '../app/models/card'
import CardStatus from '../app/models/cardStatus'
import Project from '../app/models/project'

it('given any params but without data return empty cards', async () => {
    const response = await request(server.app).get('/leadtime/projectName')
        .query({ start: '2018W50', end: '2018W51', leadtimeType: 'done' })

    expect(response.body.msg).toBe('Project projectName not found')
    expect(response.statusCode).toBe(400)
})

it('given correct params when initialize data then return correct leadtime', async () => {
    const dataBase = server.container.resolve('dataBase')
    dataBase.initialize({ cards: [
        new Card({ id: 1, issueType: 'User Story', dateEnd: new Date(2018, 11, 19), status: 'DONE', projectId: 1, transitions: [
            new CardStatus({ cardId: 1, status: 'BACKLOG', createDate: new Date(2018, 11, 3) }),
            new CardStatus({ cardId: 1, status: 'ANALYSIS', createDate: new Date(2018, 11, 11) }),
            new CardStatus({ cardId: 1, status: 'READY TODO', createDate: new Date(2018, 11, 12) }),
            new CardStatus({ cardId: 1, status: 'DOING', createDate: new Date(2018, 11, 13) }),
            new CardStatus({ cardId: 1, status: 'READY FOR QA', createDate: new Date(2018, 11, 17) }),
            new CardStatus({ cardId: 1, status: 'QA', createDate: new Date(2018, 11, 18) }),
            new CardStatus({ cardId: 1, status: 'Review', createDate: new Date(2018, 11, 18) }),
            new CardStatus({ cardId: 1, status: 'DONE', createDate: new Date(2018, 11, 19) }),
            new CardStatus({ cardId: 1, status: 'INPRODUCTION', createDate: new Date(2018, 11, 20) })
        ]})
    ], projects: [
        new Project({ id: 1, name: 'projectName', issueTracking: 'any', backlogList: ['BACKLOG'], workingList: ['ANALYSIS', 'DOING', 'QA', 'Review'], waitList: ['READY TODO', 'READY FOR QA'], doneList: ['DONE', 'INPRODUCTION']})
    ]})
    const response = await request(server.app).get('/leadtime/projectName')
        .query({ start: '2018W51', end: '2018W52', leadtimeType: 'done' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject([
        {
            id: 1,
            issueType: 'User Story',
            leadtimeTotal: 6,
            dateDone:
            {
                week: 51,
                month: 11,
                year: 2018,
                day: 19,
                dayOfWeek: 3,
                quarter: 4
            },
            transitions: [
                { name: 'ANALYSIS', leadtime: 1 },
                { name: 'READY TODO', leadtime: 1 },
                { name: 'DOING', leadtime: 2 },
                { name: 'READY FOR QA', leadtime: 1 },
                { name: 'QA', leadtime: 0 },
                { name: 'Review', leadtime: 1 }
            ],
        }
    ])
})
it('without any parameters then error response and status 422', async () => {
    const response = await request(server.app).get('/leadtime/projectName')

    expect(response.body).toMatchObject([
        { location: 'query', param: 'start', msg: 'it is mandatory' },
        { location: 'query', param: 'end', msg: 'it is mandatory' },
        { location: 'query', param: 'leadtimeType', msg: 'it is mandatory' },
        { location: 'query', param: 'leadtimeType', msg: 'must be a "done" or "wip" values' }
    ])
    expect(response.statusCode).toBe(422)
})