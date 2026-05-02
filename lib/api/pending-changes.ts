import { api } from '@/config/api-client';

export interface PendingChange {
  id: number;
  user_id: number;
  entity_type: 'user' | 'professional' | 'address' | 'service_price';
  entity_id: number | null;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export async function getMyPendingChanges(): Promise<PendingChange[]> {
  return api.get<PendingChange[]>('/users/me/pending-changes');
}

export function formatPendingAddress(jsonValue: string | null | undefined): string {
  if (!jsonValue) return '';
  try {
    const map = JSON.parse(jsonValue) as Record<string, string>;
    const parts = [
      map['street_address'],
      map['ward_no'],
      map['municipality'],
      map['district'],
      map['province'],
    ].filter((s): s is string => !!s && s.toLowerCase() !== 'n/a');
    return parts.join(', ');
  } catch {
    return jsonValue;
  }
}

export function formatPendingPrice(jsonValue: string | null | undefined): string {
  if (!jsonValue) return '';
  try {
    const map = JSON.parse(jsonValue) as Record<string, any>;
    const price = map['price'] != null ? `NPR ${map['price']}` : null;
    const discount = map['discount_is_active'] && map['discount_percentage']
      ? `${map['discount_percentage']}% off`
      : null;
    const warranty = map['has_warranty'] && map['warranty_duration']
      ? `${map['warranty_duration']} ${map['warranty_unit']} warranty`
      : null;
    return [price, discount, warranty].filter(Boolean).join(' | ');
  } catch {
    return jsonValue;
  }
}
