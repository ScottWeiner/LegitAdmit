import Link from 'next/link'

const Header = ({ currentUser }) => {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ href, label }) => {
            return (
                <li key={label} className='nav-item'>
                    <Link href={href}>
                        <a className='nav-link'>{label}</a>
                    </Link>
                </li>
            )
        })

    return (
        <nav className='navbar navbar-light bg-light'>
            <Link href='/'>
                <a className='navbar-brand'>LegitAdmit</a>
            </Link>

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    )
}

export default Header