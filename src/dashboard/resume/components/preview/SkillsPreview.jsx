function SkillsPreview({ skills = [], themeColor }) {
    const skillsByCategory = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other Skills';
        if (!acc[category]) acc[category] = [];
        if (skill.name.trim()) acc[category].push(skill); // Only show skills with names
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(skillsByCategory).length > 0 ? (
                Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category} className='mb-4'>
                        {category !== 'Other Skills' && (
                            <h3 className='font-semibold text-sm mb-2'>{category}</h3>
                        )}
                        <div className='grid grid-cols-2 gap-3'>
                            {categorySkills.map((skill, index) => (
                                <div key={index} className='flex items-center justify-between'>
                                    <span className='text-xs'>{skill.name}</span>
                                    <div className='h-2 bg-gray-200 w-[120px]'>
                                        <div
                                            className='h-2'
                                            style={{
                                                backgroundColor: themeColor,
                                                width: `${(skill.rating || 0) * 20}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-400'>Type to add skills</span>
                    <div className='h-2 bg-gray-200 w-[120px]'>
                        <div className='h-2 bg-gray-100'></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SkillsPreview