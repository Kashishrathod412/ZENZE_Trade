import React, { useState, useEffect } from 'react';
import { ShieldPlus, Edit, Trash2, Key, CheckCircle, XCircle, UserPlus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active?: boolean;
  permissions?: string[];
  createdAt: string;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'register_users', label: 'User Registration' },
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_logistics', label: 'Manage Logistics' },
  { id: 'manage_products', label: 'Manage Inventory' },
  { id: 'manage_inquiries', label: 'Manage Leads' },
  { id: 'manage_ads', label: 'Manage Ads' },
  { id: 'manage_hiring', label: 'Manage HR Command' },
  { id: 'view_analytics', label: 'View Intelligence' },
  { id: 'manage_compliance', label: 'Manage Compliance' },
  { id: 'manage_subscriptions', label: 'Manage Subscriptions' },
  { id: 'manage_support', label: 'Support Chat Access' },
];

export default function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_active: true,
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost/market-connect-hub-main/api/get_users.php");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMembers(data.filter(u => u.role === 'team_member'));
        }
      }
    } catch (e) {
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingId && !formData.password)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const action = editingId ? 'update' : 'create';
      const payload: any = {
        action,
        name: formData.name,
        email: formData.email,
        is_active: formData.is_active,
        permissions: formData.permissions
      };
      
      if (editingId) {
        payload.id = editingId;
        if (formData.password) payload.password = formData.password;
      } else {
        payload.password = formData.password;
      }

      const res = await fetch("http://localhost/market-connect-hub-main/api/manage_team_member.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Id": (() => { try { const u = localStorage.getItem("th_admin_user"); return u ? JSON.parse(u).id : "" } catch { return "" } })() },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Team member ${editingId ? 'updated' : 'created'} successfully!`);
        setShowForm(false);
        setEditingId(null);
        fetchMembers();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member? This cannot be undone.")) return;
    try {
      const res = await fetch("http://localhost/market-connect-hub-main/api/manage_team_member.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Id": (() => { try { const u = localStorage.getItem("th_admin_user"); return u ? JSON.parse(u).id : "" } catch { return "" } })() },
        body: JSON.stringify({ action: 'delete', id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Team member deleted");
        fetchMembers();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setFormData({
      name: m.name,
      email: m.email,
      password: '',
      is_active: m.is_active !== false,
      permissions: Array.isArray(m.permissions) ? m.permissions : []
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (m: TeamMember) => {
    try {
      const res = await fetch("http://localhost/market-connect-hub-main/api/manage_team_member.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Id": (() => { try { const u = localStorage.getItem("th_admin_user"); return u ? JSON.parse(u).id : "" } catch { return "" } })() },
        body: JSON.stringify({ action: 'update', id: m.id, is_active: !m.is_active })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Team member ${!m.is_active ? 'activated' : 'deactivated'}`);
        fetchMembers();
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Team Control</h2>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Manage sub-admin access & permissions</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', password: '', is_active: true, permissions: [] });
            setShowForm(true);
          }} className="rounded-xl font-bold uppercase tracking-widest gap-2">
            <UserPlus className="w-4 h-4" /> Add Member
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-card border border-border p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-black uppercase mb-6">{editingId ? 'Edit Team Member' : 'New Team Member'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-70">Full Name</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-70">Login Email</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@zenze.tech" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-70">Password {editingId && '(Leave blank to keep)'}</label>
                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="rounded-xl" required={!editingId} />
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer mt-6">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded text-primary accent-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest">Account Active</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> Access Permissions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {AVAILABLE_PERMISSIONS.map(perm => (
                  <label key={perm.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.permissions.includes(perm.id) ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted'}`}>
                    <input type="checkbox" checked={formData.permissions.includes(perm.id)} onChange={() => handleTogglePermission(perm.id)} className="w-4 h-4 accent-primary" />
                    <span className="text-xs font-bold uppercase tracking-wide">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl font-bold uppercase tracking-widest">Cancel</Button>
              <Button type="submit" className="rounded-xl font-bold uppercase tracking-widest">{editingId ? 'Save Changes' : 'Create Member'}</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center opacity-50 font-bold uppercase tracking-widest">Loading...</div>
          ) : members.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-[2rem] bg-muted/20">
              <ShieldPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No Team Members Found</p>
              <p className="text-xs font-medium text-muted-foreground mt-2 opacity-60">Add a sub-admin to delegate platform responsibilities</p>
            </div>
          ) : (
            members.map(m => (
              <div key={m.id} className={`bg-white dark:bg-card border rounded-[2rem] p-6 shadow-sm transition-all ${m.is_active === false ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                    {m.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(m)} className="p-2 hover:bg-muted rounded-lg text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-muted rounded-lg text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="font-black text-lg uppercase truncate">{m.name}</h3>
                <p className="text-xs font-bold text-muted-foreground truncate mb-4">{m.email}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => handleToggleStatus(m)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${m.is_active !== false ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'}`}>
                    {m.is_active !== false ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {m.is_active !== false ? 'Active' : 'Suspended'}
                  </button>
                  <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {Array.isArray(m.permissions) ? m.permissions.length : 0} Perms
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Access Rights</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(m.permissions) && m.permissions.length > 0 ? (
                      m.permissions.map(p => {
                        const permDef = AVAILABLE_PERMISSIONS.find(ap => ap.id === p);
                        return (
                          <span key={p} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 border rounded-md text-foreground/80">
                            {permDef ? permDef.label : p}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">No Access</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
