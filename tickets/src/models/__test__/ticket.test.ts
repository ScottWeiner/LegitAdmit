import { Ticket } from '../ticket'

it('implements Optimistic Concurrency Control', async () => {
    //Create an instance of a tcket
    const ticket = Ticket.build({
        title: 'test event',
        price: 20,
        userId: 'uesuihsfiuh'
    })

    //save instance to the DB
    await ticket.save()

    //fetch the ticket TWICE
    const instanceOne = await Ticket.findById(ticket.id)
    const instanceTwo = await Ticket.findById(ticket.id)

    //make 2 separate changes to the ticket
    instanceOne!.set({
        price: 69
    })

    instanceTwo!.set({
        title: 'Your mom',
        price: 876
    })

    //save first fetched ticket, we expect this to work
    await instanceOne!.save()

    //save the second fetched ticket, we expect this to fail because of outdated version number
    try {
        await instanceTwo!.save()
    } catch (error) {
        return
    }

    throw new Error('should not reach this point')
})

it('Increments the version number on miltiple saves', async () => {
    const ticket = Ticket.build({
        title: 'test event',
        price: 20,
        userId: 'uesuihsfiuh'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})