import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { verifyEmailCodeSchema } from '@/validation/forms';

export default function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = code.join('');
    const parsed = verifyEmailCodeSchema.safeParse(joined);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Mã không hợp lệ.');
      return;
    }
    toast.success('Đã xác nhận (demo).');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Xác nhận Email</h1>
          <p className="text-on-surface-variant text-sm">
            Chúng tôi đã gửi mã xác nhận gồm 6 chữ số đến email của bạn. Vui lòng nhập mã để tiếp tục.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleVerify}>
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            ))}
          </div>

          <button 
            type="submit" 
            disabled={code.some(d => !d)}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Chưa nhận được mã?{' '}
          <button className="font-bold text-primary hover:underline cursor-pointer">
            Gửi lại mã
          </button>
        </div>
      </div>
    </div>
  );
}
