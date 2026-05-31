'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, Users, Film, ArrowLeft, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  pitch: string;
  created_at: string;
}

interface Episode {
  id: string;
  number: number;
  title: string;
  content: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  content: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        const p = data.find((p: Project) => p.id === id);
        setProject(p || null);
      });

    fetch(`/api/projects/${id}/items`)
      .then(r => r.json())
      .then(data => {
        setEpisodes(data.episodes || []);
        setCharacters(data.characters || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const deleteItem = async (table: string, itemId: string) => {
    if (!confirm('Supprimer cet element ?')) return;
    await fetch('/api/save-content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id: itemId }),
    });
    if (table === 'episodes') setEpisodes(prev => prev.filter(e => e.id !== itemId));
    if (table === 'characters') setCharacters(prev => prev.filter(c => c.id !== itemId));
    if (selected?.id === itemId) setSelected(null);
  };

  if (loading) return (
    <div className="p-8 text-muted-foreground text-sm">Chargement...</div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour aux projets
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{project?.title || 'Projet'}</h1>
        {project?.pitch && (
          <p className="text-muted-foreground text-sm mt-1">{project.pitch}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
              Stories / Bibles ({episodes.filter(e => e.number === 0).length})
            </p>
            {episodes.filter(e => e.number === 0).length === 0 && (
              <p className="text-xs text-muted-foreground">Aucune story sauvegardee.</p>
            )}
            {episodes.filter(e => e.number === 0).map(ep => (
              <div
                key={ep.id}
                onClick={() => { setSelected(ep); setSelectedType('story'); }}
                className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all mb-2 ${
                  selected?.id === ep.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <p className="text-sm font-medium truncate max-w-[140px]">{ep.title}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteItem('episodes', ep.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
              Episodes ({episodes.filter(e => e.number > 0).length})
            </p>
            {episodes.filter(e => e.number > 0).length === 0 && (
              <p className="text-xs text-muted-foreground">Aucun episode sauvegarde.</p>
            )}
            {episodes.filter(e => e.number > 0).map(ep => (
              <div
                key={ep.id}
                onClick={() => { setSelected(ep); setSelectedType('episode'); }}
                className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all mb-2 ${
                  selected?.id === ep.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <p className="text-sm font-medium truncate max-w-[140px]">Ep.{ep.number} — {ep.title}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteItem('episodes', ep.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
              Personnages ({characters.length})
            </p>
            {characters.length === 0 && (
              <p className="text-xs text-muted-foreground">Aucun personnage sauvegarde.</p>
            )}
            {characters.map(char => (
              <div
                key={char.id}
                onClick={() => { setSelected(char); setSelectedType('character'); }}
                className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all mb-2 ${
                  selected?.id === char.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-medium truncate max-w-[140px]">{char.name}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteItem('characters', char.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedType === 'character' ? selected.name : selected.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[600px] overflow-y-auto">
                  {selected.content}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02] h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Selectionne un element pour le voir</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
