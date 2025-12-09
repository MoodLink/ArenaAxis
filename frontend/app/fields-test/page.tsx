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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Plus, Edit, Trash2, Power, PowerOff, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FieldsTestPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [filteredFields, setFilteredFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const { toast } = useToast();

  // Form state for create
  const [createForm, setCreateForm] = useState({
    sport_id: '',
    store_id: '',
    default_price: '',
    name: '',
    sport_name: '',
    address: '',
    avatar: '',
    cover_image: '',
    rating: '',
  });

  // Form state for edit
  const [editForm, setEditForm] = useState({
    sport_id: '',
    store_id: '',
    default_price: '',
    name: '',
    sport_name: '',
    address: '',
  });

  // Load all fields
  const loadFields = async () => {
    try {
      setLoading(true);
      const response = await FieldService.getFields({
        active_status: filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : undefined,
      });
      setFields(response.data);
      setFilteredFields(response.data);
    } catch (error) {
      console.error(error);
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
  }, [filterStatus]);

  // Apply filters
  useEffect(() => {
    let filtered = [...fields];

    // Filter by store
    if (storeFilter) {
      filtered = filtered.filter((f) => f.storeId === storeFilter);
    }

    // Filter by sport
    if (sportFilter) {
      filtered = filtered.filter((f) => f.sportId === sportFilter);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (f) =>
          f.storeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.sportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.defaultPrice.includes(searchTerm) ||
          f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.sport_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFields(filtered);
  }, [fields, storeFilter, sportFilter, searchTerm]);

  // Get unique store IDs
  const uniqueStores = Array.from(new Set(fields.map((f) => f.storeId))).sort();
  const uniqueSports = Array.from(new Set(fields.map((f) => f.sportId))).sort();

  // Create field
  const handleCreate = async () => {
    if (!createForm.sport_id || !createForm.store_id || !createForm.default_price) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields: Sport ID, Store ID, Price',
        variant: 'destructive',
      });
      return;
    }

    try {
      await FieldService.createField({
        sport_id: createForm.sport_id,
        store_id: createForm.store_id,
        default_price: createForm.default_price,
        name: createForm.name || undefined,
        sport_name: createForm.sport_name || undefined,
        address: createForm.address || undefined,
        avatar: createForm.avatar || undefined,
        cover_image: createForm.cover_image || undefined,
        rating: createForm.rating ? parseInt(createForm.rating) : undefined,
      });

      toast({
        title: 'Success ',
        description: 'Field created successfully',
      });

      setIsCreateDialogOpen(false);
      setCreateForm({
        sport_id: '',
        store_id: '',
        default_price: '',
        name: '',
        sport_name: '',
        address: '',
        avatar: '',
        cover_image: '',
        rating: '',
      });
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
        sport_id: editForm.sport_id || undefined,
        store_id: editForm.store_id || undefined,
        default_price: editForm.default_price || undefined,
        name: editForm.name || undefined,
        sport_name: editForm.sport_name || undefined,
        address: editForm.address || undefined,
      });

      toast({
        title: 'Success ',
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
        title: 'Success ',
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
        title: 'Success ',
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
      store_id: field.storeId,
      default_price: field.defaultPrice,
      name: field.name || '',
      sport_name: field.sport_name || '',
      address: field.address || '',
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

  // Clear all filters
  const clearFilters = () => {
    setStoreFilter('');
    setSportFilter('');
    setSearchTerm('');
    setFilterStatus('all');
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">All Fields Management</CardTitle>
              <CardDescription className="mt-2">
                Complete CRUD operations for all sports fields
              </CardDescription>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Field</DialogTitle>
                  <DialogDescription>
                    Add a new field to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create_sport_id">Sport ID *</Label>
                      <Input
                        id="create_sport_id"
                        value={createForm.sport_id}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, sport_id: e.target.value })
                        }
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="create_store_id">Store ID *</Label>
                      <Input
                        id="create_store_id"
                        value={createForm.store_id}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, store_id: e.target.value })
                        }
                        placeholder="e.g., 8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="create_price">Default Price (VNĐ) *</Label>
                    <Input
                      id="create_price"
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

                  <div>
                    <Label htmlFor="create_name">Field Name</Label>
                    <Input
                      id="create_name"
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                      placeholder="e.g., Sân A"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create_sport_name">Sport Name</Label>
                    <Input
                      id="create_sport_name"
                      value={createForm.sport_name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, sport_name: e.target.value })
                      }
                      placeholder="e.g., Badminton"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create_address">Address</Label>
                    <Input
                      id="create_address"
                      value={createForm.address}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, address: e.target.value })
                      }
                      placeholder="e.g., 123 Main St"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create_avatar">Avatar URL</Label>
                    <Input
                      id="create_avatar"
                      value={createForm.avatar}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, avatar: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create_cover">Cover Image URL</Label>
                    <Input
                      id="create_cover"
                      value={createForm.cover_image}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, cover_image: e.target.value })
                      }
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create_rating">Rating</Label>
                    <Input
                      id="create_rating"
                      type="number"
                      min="0"
                      max="5"
                      value={createForm.rating}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, rating: e.target.value })
                      }
                      placeholder="0-5"
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
                  <Button
                    onClick={handleCreate}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create Field
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">{fields.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {fields.filter((f) => f.activeStatus).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-600">
              {fields.filter((f) => !f.activeStatus).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">{uniqueStores.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Stores</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by store, sport, or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={storeFilter || 'all'} onValueChange={(val) => setStoreFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {uniqueStores.map((store) => (
                  <SelectItem key={store} value={store}>
                    Store {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sportFilter || 'all'} onValueChange={(val) => setSportFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {uniqueSports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    Sport {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
              Clear
            </Button>

            <Button variant="outline" size="icon" onClick={loadFields}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fields Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Fields List ({filteredFields.length} of {fields.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading fields...</p>
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {fields.length === 0
                  ? 'No fields found. Create your first field!'
                  : 'No fields match your filters.'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Avatar</TableHead>
                    <TableHead className="w-[150px]">Field Name</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFields.map((field) => (
                    <TableRow key={field._id} className="hover:bg-muted/50">
                      <TableCell>
                        {field.avatar ? (
                          <img
                            src={field.avatar}
                            alt={field.name || 'Field'}
                            className="h-10 w-10 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            N/A
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {field.name || `Field ${field.sportId}-${field.storeId}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        {field.sport_name || `Sport ${field.sportId}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        Store {field.storeId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {field.address || 'N/A'}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatPrice(field.defaultPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        {field.rating ? (
                          <Badge variant="outline" className="bg-yellow-50">
                            ⭐ {field.rating}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {field.activeStatus ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedField(field);
                              setIsDetailDialogOpen(true);
                            }}
                            title="View details"
                            className="hover:bg-indigo-100 text-indigo-600"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(field)}
                            title={
                              field.activeStatus
                                ? 'Deactivate field'
                                : 'Activate field'
                            }
                            className="hover:bg-orange-100"
                          >
                            {field.activeStatus ? (
                              <PowerOff className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Power className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(field)}
                            title="Edit field"
                            className="hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(field._id)}
                            title="Delete field"
                            className="hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Field Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedField?.name || 'field'}
            </DialogDescription>
          </DialogHeader>
          {selectedField && (
            <div className="space-y-6">
              {/* Image Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Avatar</p>
                  {selectedField.avatar ? (
                    <img
                      src={selectedField.avatar}
                      alt={selectedField.name}
                      className="w-full h-40 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Cover Image</p>
                  {selectedField.cover_image ? (
                    <img
                      src={selectedField.cover_image}
                      alt={selectedField.name}
                      className="w-full h-40 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Field Name</p>
                  <p className="font-semibold text-lg">{selectedField.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sport</p>
                  <p className="font-semibold text-lg">
                    {selectedField.sport_name || `Sport ${selectedField.sportId}`}
                  </p>
                </div>
              </div>

              {/* Address and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium text-sm">{selectedField.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Default Price</p>
                  <p className="font-bold text-green-600 text-lg">
                    {formatPrice(selectedField.defaultPrice)}
                  </p>
                </div>
              </div>

              {/* Store and Rating */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Store</p>
                  <p className="font-semibold text-lg">Store {selectedField.storeId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold text-lg">
                    {selectedField.rating ? `⭐ ${selectedField.rating}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold">
                    {selectedField.activeStatus ? (
                      <Badge className="bg-green-100 text-green-800"> Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800"> Inactive</Badge>
                    )}
                  </p>
                </div>
              </div>

              {/* ID and Dates */}
              <div className="border-t pt-4 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Field ID</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {selectedField._id}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {new Date(selectedField.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="text-sm">
                      {new Date(selectedField.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update field information - ID: {selectedField?._id.substring(0, 12)}...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit_store_id">Store ID</Label>
                <Input
                  id="edit_store_id"
                  value={editForm.store_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, store_id: e.target.value })
                  }
                />
              </div>
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

            <div>
              <Label htmlFor="edit_name">Field Name</Label>
              <Input
                id="edit_name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit_sport_name">Sport Name</Label>
              <Input
                id="edit_sport_name"
                value={editForm.sport_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, sport_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit_address">Address</Label>
              <Input
                id="edit_address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
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
            <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
              Update Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
