/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from 'react';
import ResearchResult from '@/components/ResearchResult';
import ResearchProgress from '@/components/ResearchProgress';
import { Stage } from "@/lib/stages";
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage.Finalizing | Stage.Researching | Stage.Planning | null>(null);
  const [error, setError] = useState('');
  const [researchTopic, setResearchTopic] = useState('');
  const [researchResult, setResearchResult] = useState<any | null>(null);

  const startResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopic.trim()) {
      toast.error('Please provide a research topic or question', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/research', { topic: researchTopic });
      console.log(response.data);
      setResearchResult(response.data);
    } catch (error) {
      setError(`Failed to start research ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-400">
            Sypher
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Powered by advanced AI to conduct thorough research on any topic. Get comprehensive,
            well-structured reports with verified sources and expert analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Start New Research</h2>
              <form onSubmit={startResearch}>
                <div className="mb-4">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
                    Research Topic / Question
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="Enter a research topic or question"
                    className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-gray-100"
                    disabled={isLoading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !researchTopic.trim()}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading || !researchTopic.trim()
                    ? 'bg-indigo-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    } transition-colors duration-200`}
                >
                  {isLoading ? 'Researching...' : 'Start Deep Research'}
                </button>
              </form>
            </div>

            {!isLoading && researchResult && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Research Summary
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Topic: {researchTopic}
                </p>
                <button
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <ResearchProgress currentStage={currentStage} />
            ) : (
              researchResult && <ResearchResult content={researchResult} />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-900 text-red-200 rounded-md flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}