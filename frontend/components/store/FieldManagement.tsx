'use client';

import { useState, useEffect } from 'react';
import { FieldService, Field } from '@/services/field.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FieldManagementProps {
  storeId: string;
}

export function FieldManagement({ storeId }: FieldManagementProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  // Form state for create
  const [createForm, setCreateForm] = useState({
    sport_id: '',
    default_price: '',
  });

  // Form state for edit
  const [editForm, setEditForm] = useState({
    sport_id: '',
    default_price: '',
  });

  // Load fields
  const loadFields = async () => {
    try {
      setLoading(true);
      let response;

      if (filterStatus === 'active') {
        response = await FieldService.getFields({
          store_id: storeId,
          active_status: true,
        });
      } else if (filterStatus === 'inactive') {
        response = await FieldService.getFields({
          store_id: storeId,
          active_status: false,
        });
      } else {
        response = await FieldService.getFieldsByStore(storeId);
      }

      setFields(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load fields',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, [storeId, filterStatus]);

  // Create field
  const handleCreate = async () => {
    try {
      await FieldService.createField({
        sport_id: createForm.sport_id,
        store_id: storeId,
        default_price: createForm.default_price,
      });

      toast({
        title: 'Success',
        description: 'Field created successfully',
      });

      setIsCreateDialogOpen(false);
      setCreateForm({ sport_id: '', default_price: '' });
      loadFields();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create field',
        variant: 'destructive',
      });
    }
  };

  // Update field
  const handleUpdate = async () => {
    if (!selectedField) return;

    try {
      await FieldService.updateField(selectedField._id, {
        sport_id: editForm.sport_id,
        default_price: editForm.default_price,
      });

      toast({
        title: 'Success',
        description: 'Field updated successfully',
      });

      setIsEditDialogOpen(false);
      setSelectedField(null);
      loadFields();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update field',
        variant: 'destructive',
      });
    }
  };

  // Toggle status
  const handleToggleStatus = async (field: Field) => {
    try {
      await FieldService.toggleFieldStatus(field._id, field.activeStatus);

      toast({
        title: 'Success',
        description: `Field ${field.activeStatus ? 'deactivated' : 'activated'} successfully`,
      });

      loadFields();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update field status',
        variant: 'destructive',
      });
    }
  };

  // Delete field
  const handleDelete = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      await FieldService.deleteField(fieldId);

      toast({
        title: 'Success',
        description: 'Field deleted successfully',
      });

      loadFields();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete field',
        variant: 'destructive',
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (field: Field) => {
    setSelectedField(field);
    setEditForm({
      sport_id: field.sportId,
      default_price: field.defaultPrice,
    });
    setIsEditDialogOpen(true);
  };

  // Format price
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fields Management</h2>
          <p className="text-muted-foreground">
            Manage your sports fields
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Field</DialogTitle>
              <DialogDescription>
                Add a new field to your store
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sport_id">Sport ID</Label>
                <Input
                  id="sport_id"
                  value={createForm.sport_id}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, sport_id: e.target.value })
                  }
                  placeholder="Enter sport ID"
                />
              </div>
              <div>
                <Label htmlFor="price">Default Price (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={createForm.default_price}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      default_price: e.target.value,
                    })
                  }
                  placeholder="100000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No fields found. Create your first field!
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sport ID</TableHead>
                <TableHead>Default Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field._id}>
                  <TableCell className="font-medium">
                    {field.sportId}
                  </TableCell>
                  <TableCell>{formatPrice(field.defaultPrice)}</TableCell>
                  <TableCell>
                    {field.activeStatus ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(field.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(field)}
                        title={
                          field.activeStatus
                            ? 'Deactivate'
                            : 'Activate'
                        }
                      >
                        {field.activeStatus ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(field._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update field information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_sport_id">Sport ID</Label>
              <Input
                id="edit_sport_id"
                value={editForm.sport_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, sport_id: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit_price">Default Price (VNĐ)</Label>
              <Input
                id="edit_price"
                type="number"
                value={editForm.default_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, default_price: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
