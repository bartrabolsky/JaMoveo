import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRolePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-4 text-white">
            <div className="max-w-md sm:max-w-xl w-full mx-auto text-center">
                {/* Main title */}
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 select-none drop-shadow-lg">
                    JaMoveo
                </h1>

                {/* Subtitle */}
                <h2 className="text-lg sm:text-xl mb-6">
                    Choose Registration Type
                </h2>

                {/* Buttons */}
                <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
                    <button
                        className="bg-purple-700 hover:bg-purple-600 transition-colors px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg"
                        onClick={() => navigate('/user-signup')}
                    >
                        User Signup
                    </button>

                    <button
                        className="bg-indigo-700 hover:bg-indigo-600 transition-colors px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg"
                        onClick={() => navigate('/admin-signup')}
                    >
                        Admin Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseRolePage;
