import React, { useState, useEffect, useRef } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import useDebounce from '~/hooks/useDebounce';
import request from '~/utils/request';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
const Search = ({ value, keyword }) => {
    // const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const location = useLocation();
    const history = useHistory();
    const inputRef = useRef();
    const debounce = useDebounce(value?.searchValue, 500);
    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword?.keyword !== value?.searchValue && value?.searchValue !== '') {
            keyword?.setKeyword(value?.searchValue);
        }
        setShowResult(false);
    };
    // useEffect(() => {
    //     // if (keyword !== undefined) {
    //     //     if (keyword.trim() && keyword) {
    //     //         history.push(`/search/${keyword}`);
    //     //     }
    //     // }
    // }, []);
    useEffect(() => {
        if (keyword?.keyword !== undefined) {
            if (keyword?.keyword.trim() && keyword?.keyword) {
                history.push(`/search/${keyword?.keyword}`);
            }
            // if (!keyword && searchValue && history.location.pathname === '/') setSearchValue('');
        }
    }, [keyword?.keyword]);
    const handleClear = () => {
        value.setSearchValue('');
        inputRef.current.reset();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
    useEffect(() => {
        if (!debounce?.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            try {
                const res = await request.get('/api/product/search', {
                    params: {
                        keyword: debounce,
                    },
                });
                setSearchResult(res.data);
            } catch (error) {}
        };
        fetchApi();
    }, [debounce]);
    return (
        <HeadlessTippy
            interactive
            // visible="true"
            visible={searchResult.length > 0 && showResult}
            render={(attrs) => (
                <div
                    className="shadow-sm"
                    style={{
                        position: 'absolute',
                        right: '-200px',
                        width: '490px',
                        top: '56px',
                        borderRadius: '5px',
                        zIndex: '15',
                        backgroundColor: 'white',
                    }}
                >
                    {searchResult?.slice(0, 9)?.map((item) => (
                        <div
                            className="search-item"
                            // to={`/search/${item.name}`}
                            onClick={() => {
                                value.setSearchValue(item.name);
                                keyword?.setKeyword(item.name);
                                setShowResult(false);
                            }}
                            style={{ cursor: 'pointer', padding: '5px 5px', display: 'flex', alignItems: 'center' }}
                        >
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <form className="input-group">
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <div className={'search-wrap d-flex'}>
                        <input
                            // ref={refSearch}
                            type="search"
                            className="form-control rounded search search-focus"
                            placeholder="Search"
                            value={value.searchValue}
                            onChange={(e) => {
                                const searchInput = e.target.value;

                                if (!e.target.value.startsWith(' ')) {
                                    value.setSearchValue(e.target.value.trim());
                                }
                            }}
                            onFocus={() => {
                                setShowResult(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    inputRef.current.focus({ focusVisible: true });
                                }
                            }}
                        />
                        <button
                            ref={inputRef}
                            type="submit"
                            onClick={submitHandler}
                            className="search-button search-btn-header"
                        >
                            <i className="fas fa-search submit-search"></i>
                        </button>
                    </div>
                </div>
            </form>
        </HeadlessTippy>
    );
};

export default React.memo(Search);
