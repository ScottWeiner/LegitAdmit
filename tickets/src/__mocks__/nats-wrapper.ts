//faking the actual natsWrapper functionality
//It returns an object, so this will as well with some fake implementation inside

export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();

        })

    }
}

