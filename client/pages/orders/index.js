const OrderIndex = ({ orders }) => {

    return (
        <div>
            <ul>
                {orders.map((ord) => {
                    return <li key={ord._id}>{ord.ticket.title} - {ord.status}</li>
                })}
            </ul>
        </div>
    )
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders')

    return { orders: data }
}




export default OrderIndex