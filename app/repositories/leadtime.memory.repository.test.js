import Period from '../models/period'
import Task from '../models/task'
import TaskStatus from '../models/taskStatus'
import LeadtimeInMemoryRepository from './leadtime.memory.repository'

const initializeRepository = function () {
    const leadtimeRepository = new LeadtimeInMemoryRepository()
    leadtimeRepository.initialize([
        new Task(1, 'Bug', new Date(2018, 11, 12), 'done', 1, [
            new TaskStatus(1, 'BACKLOG', new Date(2018, 11, 3)),
            new TaskStatus(1, 'DOING', new Date(2018, 11, 11)),
            new TaskStatus(1, 'DONE', new Date(2018, 11, 12))]),
        new Task(2, 'Bug', undefined, 'doing', 1, [
            new TaskStatus(1, 'BACKLOG', new Date(2018, 11, 3)),
            new TaskStatus(1, 'DOING', new Date(2018, 11, 11))]),
        new Task(3, 'Bug', undefined, 'doing', 1, [
            new TaskStatus(1, 'BACKLOG', new Date(2018, 11, 3)),
            new TaskStatus(1, 'DOING', new Date(2018, 11, 24))]),
        new Task(4, 'Bug', undefined, 'doing', 1, [
            new TaskStatus(1, 'BACKLOG', new Date(2018, 11, 3))])
    ])
    return leadtimeRepository
}

it('when find without data, then return empty array', async () => {
    const period = new Period('2018W50', '2018W51')
    const leadtimeRepository = new LeadtimeInMemoryRepository()

    const tasks = await leadtimeRepository.find(1, period, true)

    expect(tasks).toBeDefined()
    expect(tasks).toHaveLength(0)
})

it('when finding with a period of one week and onlyDone then return all done task withing this week', async () => {
    const period = new Period('2018W50', '2018W51')

    const tasks = await initializeRepository().find(1, period, true)

    expect(tasks).toHaveLength(1)
})
it('when finding with a period of one week and wip then return all not done task withing this week', async () => {
    const period = new Period('2018W50', '2018W51')

    const tasks = await initializeRepository().find(1, period, false)

    expect(tasks).toHaveLength(1)
})