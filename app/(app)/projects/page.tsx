'use client';

import { useState, useEffect } from 'react';
import { Folder, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { getAuthHeaders } from '@/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  pitch: string;
  bible: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPitch, setNewPitch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/projects', { headers });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const createProject = async () => {
    if (!newTitle) return;
    setCreating(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: newTitle, pitch: newPitch }),
      });
      const data = await res.json();
      setProjects(prev => [data, ...prev]);
      setNewTitle('');
      setNewPitch('');
    } catch (e) {
      console.error(e);
    }
    setCreating(false);
  };

  const deleteProject = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Supprimer ce projet ?')) return;
    const headers = await getAuthHeaders();
    await fetch('/api/projects', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Mes Projets</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sauvegarde et retrouve tes series.
        </p>
      </div>

      <Card className="border-white/5 bg-white/[0.02] mb-8">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Nom du projet
            </Label>
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Ex : Les Heritiers"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Pitch (optionnel)
            </Label>
            <Input
              value={newPitch}
              onChange={e => setNewPitch(e.target.value)}
              placeholder="Ex : Deux ados tombent amoureux sans savoir..."
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button
            onClick={createProject}
            disabled={creating || !newTitle}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            {creating ? 'Creation...' : 'Creer le projet'}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : projects.length === 0 ? (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="text-center py-20">
            <Folder className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Aucun projet pour l&apos;instant.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-400/20 flex items-center justify-center">
                        <Folder className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{project.title}</p>
                        {project.pitch && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-md truncate">
                            {project.pitch}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => deleteProject(e, project.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
