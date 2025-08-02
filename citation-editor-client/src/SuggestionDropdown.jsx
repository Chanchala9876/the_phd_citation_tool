import React from 'react';
import { Paper, Text, Group, Stack, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { IconBook, IconUser, IconClick } from '@tabler/icons-react';

const SuggestionDropdown = ({ suggestions, onSelect, position }) => {
  if (!position || suggestions.length === 0) return null;

  return (
    <Paper
      shadow="xl"
      p="md"
      className="slide-in"
      style={{
        position: 'absolute',
        top: position.top + 10,
        left: position.left,
        zIndex: 9999,
        maxHeight: '350px',
        overflowY: 'auto',
        width: '450px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      }}
      withBorder
    >
      <Stack spacing="md">
        {suggestions.map((suggestion, index) => (
          <Paper
            key={index}
            p="md"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.8) 100%)',
            }}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.8) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            withBorder
          >
            <Group position="apart" align="flex-start">
              <Stack spacing="sm" style={{ flex: 1 }}>
                <Group spacing="xs" align="center">
                  <IconBook size={18} color="#667eea" style={{ filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))' }} />
                  <Text size="sm" weight={700} style={{ 
                    color: '#667eea',
                    textShadow: '0 1px 2px rgba(102, 126, 234, 0.2)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {suggestion.title}
                  </Text>
                </Group>
                
                <Group spacing="xs" align="center">
                  <IconUser size={16} color="#6c757d" />
                  <Text size="xs" color="dimmed" weight={500}>
                    {suggestion.author}
                  </Text>
                </Group>
                
                {suggestion.year && (
                  <Badge 
                    size="sm" 
                    variant="gradient" 
                    gradient={{ from: '#667eea', to: '#764ba2' }}
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {suggestion.year}
                  </Badge>
                )}
              </Stack>
              
              <Tooltip label="Click to insert citation" withArrow>
                <ActionIcon 
                  size="md" 
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2' }}
                  style={{ 
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <IconClick size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Paper>
        ))}
      </Stack>
      
      {suggestions.length > 0 && (
        <Paper 
          p="sm" 
          mt="md" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderTop: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Text size="xs" color="dimmed" align="center" weight={500}>
            ✨ Click on any suggestion to insert the citation
          </Text>
        </Paper>
      )}
    </Paper>
  );
};

export default SuggestionDropdown;
