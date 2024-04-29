import { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { regionLanguageMap } from '../constants';
import Generator from '../generate/generate';
import { UserData } from '../interfaces';
import { generateRandomSeed, generateUserData, setFakerSeed } from '../utils';

const Data = () => {
    const tableRef = useRef<HTMLTableElement>(null);

    const [region, setRegion] = useState<string>('USA');
    const [errorCount, setErrorCount] = useState<number>(0);
    const [seed, setSeed] = useState<number>(0);

    const [userData, setUserData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const languageModule = regionLanguageMap[region];

    const generateData = () => {
        scrollToTop();
        setIsLoading(true);
        setFakerSeed(languageModule, seed);
        const generator = new Generator(languageModule);
        const data: UserData[] = Array.from({ length: 20 }, (_, index) =>
            generateUserData(languageModule, index + 1)
        ).map(({ index, identifier, name, address, phone }) => ({
            ...generator.generate(errorCount, { name, address, phone }),
            index,
            identifier
        }));
        setIsLoading(false);
        setUserData(data);
    };

    const loadMoreData = () => {
        setIsLoading(true);
        const startIndex = userData.length + 1;
        setFakerSeed(languageModule, seed, startIndex);
        const generator = new Generator(languageModule);
        const newData: UserData[] = Array.from({ length: 10 }, (_, index) =>
            generateUserData(languageModule, startIndex + index)
        ).map(({ index, identifier, name, address, phone }) => ({
            ...generator.generate(errorCount, { name, address, phone }),
            index,
            identifier
        }));
        setIsLoading(false);
        setUserData((prevData) => [...prevData, ...newData]);
    };

    useEffect(generateData, [region, errorCount, seed, languageModule]);

    const scrollToTop = () => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            loadMoreData();
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
    };

    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value);
        const maxInt = Number.MAX_SAFE_INTEGER;
        if (isNaN(value)) {
            value = 0;
        } else if (value > maxInt) {
            value = maxInt;
        }
        setSeed(value);
    };

    const handleSliderChange = (value: number) => {
        setErrorCount(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value);
        if (isNaN(value)) {
            value = 0;
        } else if (value > 1000) {
            value = 1000;
        }
        setErrorCount(value);
    };

    const handleGenerateClick = () => {
        setSeed(generateRandomSeed(languageModule));
    };

    const handleExportClick = () => {
        return userData.map((user) => ({
            Index: user.index,
            Identifier: user.identifier,
            Name: user.name,
            Address: user.address,
            Phone: user.phone
        }));
    };

    return (
        <div className="container mx-auto">
            <div className="mt-4">
                <label htmlFor="region" className="mr-2">Region</label>
                <select id="region" value={region} onChange={handleRegionChange} className="border rounded-md p-1">
                    <option value="USA">USA</option>
                    <option value="Russia">Russia</option>
                    <option value="Turkey">Turkey</option>
                </select>
            </div>
            <div className="mt-4">
                <label htmlFor="errorCount" className="mr-2">Error Count</label>
                <input
                    type="range"
                    id="errorCount"
                    min="0"
                    max="10"
                    step="0.25"
                    value={errorCount}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="border rounded-md p-1"
                />
                <input
                    type="number"
                    min="0"
                    max="1000"
                    value={errorCount}
                    onChange={handleInputChange}
                    className="border rounded-md p-1 ml-2"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="seed" className="mr-2">Seed</label>
                <input
                    type="number"
                    min="0"
                    value={seed}
                    onChange={handleSeedChange}
                    className="border rounded-md p-1"
                />
                <button onClick={handleGenerateClick} className="bg-gray-200 text-gray-800 px-2 py-1 ml-2 rounded-md">Random</button>
            </div>
            <div className="mt-4 max-h-96 overflow-y-scroll " onScroll={handleScroll}>
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Index</th>
                            <th className="px-4 py-2">Id</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user.index} className="border-t">
                                <td className="px-4 py-2">{user.index}</td>
                                <td className="px-4 py-2">{user.identifier}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.address}</td>
                                <td className="px-4 py-2">{user.phone}</td>
                            </tr>
                        ))}
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="text-center py-2">
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <CSVLink
                    data={handleExportClick()}
                    filename={'fake_data.csv'}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    target="_blank"
                >
                    Export to CSV
                </CSVLink>
            </div>
        </div>
    );
};

export default Data;
