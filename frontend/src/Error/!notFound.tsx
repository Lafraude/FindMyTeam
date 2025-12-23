import { Link } from 'react-router-dom';
import FuzzyText from './FuzzyText';
import './notFound.css'

function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}><FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.2}
            >404</FuzzyText></h1>
            <h2>Page Not Found</h2>
            <p style={{ color: '#666', marginTop: '1rem' }}>
                The page you're looking for doesn't exist.
            </p>
            <Link to="/" style={{marginTop: '20px'}}>Go Home</Link>
        </div>
    )
}

export default NotFound;