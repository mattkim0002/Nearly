import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface ListsPageProps {
  user: any;
  onSignOut: () => void;
}

export default function ListsPage({ user, onSignOut }: ListsPageProps) {
  const navigate = useNavigate();
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'gigs' | 'sellers' | 'inspiration'>('sellers');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Load favorites and lists on mount
  useEffect(() => {
    console.log('Loading favorites...');
    const loadedFavorites = JSON.parse(localStorage.getItem('nearly_favorites') || '[]');
    console.log('Loaded favorites:', loadedFavorites);
    setFavorites(loadedFavorites);
    
    // Load saved lists
    const savedLists = JSON.parse(localStorage.getItem('nearly_lists') || '[]');
    
    // Count by type
    const gigs = loadedFavorites.filter((f: any) => f.type === 'gig').length;
    const sellers = loadedFavorites.filter((f: any) => f.type === 'seller').length;
    const inspiration = loadedFavorites.filter((f: any) => f.type === 'inspiration').length;
    
    // Create/update "My favorites" list
    const myFavoritesList = {
      id: 'favorites',
      name: "My favorites",
      category: "all",
      items: loadedFavorites,
      gigs,
      sellers,
      inspiration,
      isPrivate: true,
      createdAt: new Date().toISOString()
    };
    
    // Combine with saved lists
    const allLists = [myFavoritesList, ...savedLists];
    setLists(allLists);
    
    // Auto-select the My favorites list
    setSelectedList(myFavoritesList);
  }, []);

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName,
        category: "",
        items: [],
        gigs: 0,
        sellers: 0,
        inspiration: 0,
        isPrivate: true,
        createdAt: new Date().toISOString()
      };
      
      // Add to lists
      const updatedLists = [...lists.filter(l => l.id !== 'favorites'), newList];
      setLists([lists[0], ...updatedLists]); // Keep "My favorites" first
      
      // Save to localStorage (excluding My favorites which is auto-generated)
      localStorage.setItem('nearly_lists', JSON.stringify(updatedLists));
      
      setNewListName('');
      setShowCreateModal(false);
    }
  };
  
  const handleRemoveFavorite = (itemId: number) => {
    const updated = favorites.filter((f: any) => f.id !== itemId);
    setFavorites(updated);
    localStorage.setItem('nearly_favorites', JSON.stringify(updated));
    
    // Update the counts
    const gigs = updated.filter((f: any) => f.type === 'gig').length;
    const sellers = updated.filter((f: any) => f.type === 'seller').length;
    const inspiration = updated.filter((f: any) => f.type === 'inspiration').length;
    
    // Update selected list
    if (selectedList && selectedList.id === 'favorites') {
      setSelectedList({
        ...selectedList,
        items: updated,
        gigs,
        sellers,
        inspiration
      });
    }
    
    // Update lists
    const updatedLists = lists.map(list => {
      if (list.id === 'favorites') {
        return {
          ...list,
          items: updated,
          gigs,
          sellers,
          inspiration
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  // Filter favorites by active tab
  const filteredFavorites = selectedList ? favorites.filter((f: any) => f.type === activeTab) : [];
  
  console.log('Active tab:', activeTab);
  console.log('Filtered favorites:', filteredFavorites);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {selectedList ? (
          /* List Detail View - Fiverr Style */
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <button onClick={() => setSelectedList(null)} className="hover:text-orange-500">Home</button>
              <span>›</span>
              <button onClick={() => setSelectedList(null)} className="hover:text-orange-500">My Lists</button>
            </div>

            {/* List Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-slate-900">{selectedList.name}</h1>
                <span className="flex items-center gap-1 text-slate-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  Private list
                </span>
                <button className="ml-auto p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {selectedList.category && (
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                  {selectedList.category}
                </span>
              )}

              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.user_metadata?.name?.[0] || 'M'}
                </div>
                <span>Created by {user?.user_metadata?.name || 'Matthew Kim'}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('gigs')}
                  className={`pb-3 font-medium transition border-b-2 ${
                    activeTab === 'gigs'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gigs ({selectedList.gigs})
                </button>
                <button
                  onClick={() => setActiveTab('sellers')}
                  className={`pb-3 font-medium transition border-b-2 ${
                    activeTab === 'sellers'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sellers ({selectedList.sellers})
                </button>
                <button
                  onClick={() => setActiveTab('inspiration')}
                  className={`pb-3 font-medium transition border-b-2 ${
                    activeTab === 'inspiration'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inspiration ({selectedList.inspiration})
                </button>
              </div>
            </div>

            {/* Empty State or Favorites List */}
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Keep everything you like right here!
                </h3>
                <p className="text-slate-600">
                  Here are some ideas to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredFavorites.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition p-6 relative group"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-orange-100"
                      title="Remove from favorites"
                    >
                      <span className="text-orange-600 text-sm">×</span>
                    </button>

                    <div 
                      onClick={() => navigate(`/pro/${item.id}`)}
                      className="cursor-pointer"
                    >
                      {/* Avatar */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                          {item.data.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900">{item.data.name}</h3>
                          <p className="text-sm text-slate-600">{item.data.location}</p>
                        </div>
                      </div>

                      {/* Title */}
                      <p className="text-slate-600 text-sm mb-4">{item.data.title}</p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                        <div>
                          <p className="text-xs text-slate-600">Rating</p>
                          <p className="font-bold text-slate-900">⭐ {item.data.rating}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Jobs</p>
                          <p className="font-bold text-slate-900">{item.data.jobs}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-600">Starting at</p>
                          <p className="font-bold text-orange-500 text-lg">{item.data.startingAt}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pro/${item.id}`);
                          }}
                          className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition text-sm"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Lists Grid View */
          <div>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">My lists</h1>
                <p className="text-slate-600">
                  Organize your go-to freelancers and favorite services into<br />
                  custom lists you can easily access and share with your team.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition shadow-lg whitespace-nowrap"
              >
                + Create a List
              </button>
            </div>

            {/* Lists Grid */}
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              {/* Create New List Card */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl hover:border-orange-300 hover:bg-sky-50 transition flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-5xl text-orange-600 mb-3">+</span>
                <span className="text-orange-500 font-semibold">Create a List</span>
              </button>

              {/* User's Lists */}
              {lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setSelectedList(list)}
                  className="aspect-square bg-white border-2 border-slate-200 rounded-2xl hover:border-orange-300 hover:shadow-lg transition p-6 cursor-pointer flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">{list.name}</h3>
                    <p className="text-sm text-slate-600">
                      {list.gigs + list.sellers + list.inspiration} items
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {new Date(list.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      ⋯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Create a List</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                List Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Favorite Woodworkers"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}