import axios from 'axios';
import React, { useState, FormEvent } from 'react';

// Define types for the result structure
interface AnalysisResult {
  vendor: string;
  result: string;
}

const UrlChecker: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Url = btoa(url);

      const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${base64Url}`, {
        headers: {
          "x-apikey": "d19b89dae065c263ebfde4e3372fae6f0ae5dd2821f8d3a1c75c41ae1136b86e", // Replace with your actual VirusTotal API key
        },
      });

      const analysisResults = response.data.data.attributes.last_analysis_results;

      const formattedResults = Object.entries(analysisResults).map(([vendor, data]: [string, any]) => {
        return {
          vendor: vendor,
          result: data.result,
        };
      });

      setResult(formattedResults);
    } catch (err) {
      setError('Error checking the URL. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r w-[1200px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-[300px]">
      <div className="max-w-3xl !w-full border p-8 rounded-lg shadow-2xl border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-center dark:text-white text-gray-800 mb-6"> URL Safety Checker</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="url"
              value={url}
              onChange={handleInputChange}
              placeholder="Enter URL to scan"
              required
              className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center mb-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Checking...' : 'Check URL'}
            </button>
          </div>
        </form>

        {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}

        {result && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full table-auto bg-gray-50 p-6 rounded-md border border-gray-300 shadow-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Vendor</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Result</th>
                </tr>
              </thead>
              <tbody>
                {result.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-3 px-6 text-sm text-gray-700 font-medium">{entry.vendor}</td>
                    <td className="py-3 px-6 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          entry.result === 'clean'
                            ? 'bg-green-500'
                            : entry.result === 'suspicious'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                        }`}
                      >
                        {entry.result.charAt(0).toUpperCase() + entry.result.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlChecker;
