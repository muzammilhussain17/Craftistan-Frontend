import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { Button } from '../components/ui/Button';
import { CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Confirmation() {
    return (
        <CheckoutLayout>
            <div className="text-center bg-white p-12 rounded-2xl shadow-soft border border-stone-100">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-4xl font-serif text-stone-900 mb-4">Shukriya! Your order is placed.</h1>
                <p className="text-lg text-stone-500 max-w-md mx-auto mb-10">
                    We've sent a confirmation email to <strong>ali@example.com</strong>. Your one-of-a-kind piece is being prepared with care.
                </p>

                <div className="bg-stone-50 p-6 rounded-xl max-w-sm mx-auto mb-10 text-left border border-stone-200">
                    <div className="flex items-start gap-4 mb-4">
                        <Truck className="w-5 h-5 text-stone-400 mt-0.5" />
                        <div>
                            <span className="block font-medium text-stone-900">Estimated Delivery</span>
                            <span className="text-stone-500">Dec 20 - Dec 22</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="font-serif text-lg text-stone-400 w-5 text-center">#</span>
                        <div>
                            <span className="block font-medium text-stone-900">Order Number</span>
                            <span className="text-stone-500">ORD-9283-PK</span>
                        </div>
                    </div>
                </div>

                <Link to="/">
                    <Button variant="primary" className="px-8">
                        Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </CheckoutLayout>
    );
}
