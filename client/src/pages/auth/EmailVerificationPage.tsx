import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from '../../context/store/authStore';
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyOtp} = useAuthStore();

	const handleChange = (index: number, value: string) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);


			// Focus on the last non-empty input or the first empty one
			let lastFilledIndex = -1;
			for (let i = newCode.length - 1; i >= 0; i--) {
				if (newCode[i] !== "") {
					lastFilledIndex = i;
					break;
				}
			}
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex]?.focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (index : number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const verificationCode = code.join("");
    try {
      await verifyOtp(verificationCode);
	  toast.success("Email verified successfully");
	  
      navigate("/");

    } catch (error) {
      toast.error("Error verifying email");
      console.log(error);
    }
	
  }, [code, verifyOtp, navigate]);

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code, handleSubmit]);

	return (
	<div className=' w-full bg-white  min-h-screen flex items-center justify-center rounded-2xl shadow-xl overflow-hidden'>
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-green-700 text-transparent bg-clip-text'>
				Verify Your Email
			</h2>
			<p className='text-center text-gray-700 mb-6'>
				Enter the 6-digit code sent to your email address.
			</p>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex justify-between'>
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type='text'
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className='w-12 h-12 text-center text-2xl font-bold bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none'
						/>
					))}
				</div>
				{error && (
					<p className='text-red-600 font-semibold mt-2'>{error}</p>
				)}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					type='submit'
					disabled={isLoading || code.some((digit) => !digit)}
					className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
				>
					{isLoading ? 'Verifying...' : 'Verify Email'}
				</motion.button>
			</form>
		</motion.div>
	</div>
);
};
export default EmailVerificationPage;