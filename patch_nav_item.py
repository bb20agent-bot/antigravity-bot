with open('user/UserApp.tsx', 'r') as f:
    content = f.read()

search_nav = """const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-2 transition-all relative ${active ? 'scale-125 text-[#0088cc]' : 'text-gray-600'}`}
    >"""

replace_nav = """const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void; label?: string }> = ({ icon, active, onClick, label }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`p-2 transition-all relative focus-visible:ring-2 ${active ? 'scale-125 text-[#0088cc]' : 'text-gray-600'}`}
    >"""

content = content.replace(search_nav, replace_nav)

# Search for the specific button and replace it
search_home = """                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            active={activeTab === NavTab.HOME}
                            onClick={() => setActiveTab(NavTab.HOME)}
                        />"""

replace_home = """                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            active={activeTab === NavTab.HOME}
                            onClick={() => setActiveTab(NavTab.HOME)}
                            label="Home"
                        />"""
content = content.replace(search_home, replace_home)

search_crew = """                        <NavItem
                            icon={<Trophy size={20} />}
                            active={activeTab === NavTab.CREW}
                            onClick={() => { setActiveTab(NavTab.CREW); setSelectedCrew(null); }}
                        />"""

replace_crew = """                        <NavItem
                            icon={<Trophy size={20} />}
                            active={activeTab === NavTab.CREW}
                            onClick={() => { setActiveTab(NavTab.CREW); setSelectedCrew(null); }}
                            label="Crew"
                        />"""
content = content.replace(search_crew, replace_crew)


search_center = """                            <button
                                onClick={() => setActiveTab(NavTab.OFFICE)}
                                className={`w-14 h-14 rounded-full bg-gradient-to-br border-4 border-[#050505] shadow-[0_4px_25px_rgba(220,38,38,0.5)] flex items-center justify-center transition-transform ${activeTab === NavTab.OFFICE
                                    ? 'from-red-600 to-red-900 ring-4 ring-red-500/50 ring-offset-2 ring-offset-[#050505] scale-110'
                                    : 'from-slate-800 to-black hover:from-red-800 hover:to-red-900'
                                    }`}
                            >"""

replace_center = """                            <button
                                onClick={() => setActiveTab(NavTab.OFFICE)}
                                aria-label="My Office"
                                className={`w-14 h-14 rounded-full bg-gradient-to-br border-4 border-[#050505] shadow-[0_4px_25px_rgba(220,38,38,0.5)] flex items-center justify-center transition-transform focus-visible:ring-2 ${activeTab === NavTab.OFFICE
                                    ? 'from-red-600 to-red-900 ring-4 ring-red-500/50 ring-offset-2 ring-offset-[#050505] scale-110'
                                    : 'from-slate-800 to-black hover:from-red-800 hover:to-red-900'
                                    }`}
                            >"""
content = content.replace(search_center, replace_center)

search_info = """                        <NavItem
                            icon={<Crown size={20} />}
                            active={activeTab === NavTab.INFO}
                            onClick={() => setActiveTab(NavTab.INFO)}
                        />"""

replace_info = """                        <NavItem
                            icon={<Crown size={20} />}
                            active={activeTab === NavTab.INFO}
                            onClick={() => setActiveTab(NavTab.INFO)}
                            label="Info"
                        />"""
content = content.replace(search_info, replace_info)

search_game = """                        <NavItem
                            icon={<Gamepad2 size={20} />}
                            active={activeTab === NavTab.GAME}
                            onClick={() => setActiveTab(NavTab.GAME)}
                        />"""
replace_game = """                        <NavItem
                            icon={<Gamepad2 size={20} />}
                            active={activeTab === NavTab.GAME}
                            onClick={() => setActiveTab(NavTab.GAME)}
                            label="Game"
                        />"""
content = content.replace(search_game, replace_game)

with open('user/UserApp.tsx', 'w') as f:
    f.write(content)
