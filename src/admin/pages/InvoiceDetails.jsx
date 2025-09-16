import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import Container from "../../components/layout/Container"

const InvoiceDetails = () => {
    return (
        <Container>
            <div className="py-4">
                <Link><ArrowLeft className="w-6 h-6" /> Back</Link>
            </div>
        </Container>
    )
}

export default InvoiceDetails