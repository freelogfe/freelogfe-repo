import * as React from 'react';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import styles from './index.less';
import {Space, Switch} from 'antd';
import {EditOutlined, CopyOutlined} from '@ant-design/icons';
import {FCircleButton, FTextButton} from '@/components/FButton';
import FHorn from '@/pages/resource/components/FHorn';
import {FContentText} from "@/components/FText";
import {ResourcesProps} from "@/pages/resource/containers/FDepPanel/Resources";
import {i18nMessage} from "@/utils/i18n";

type Data = Readonly<{
  key: string;
  value: string;
  description: string;
  allowCustom: boolean;
  custom: 'input' | 'select';
  customOption: string;
}>;

export type FCustomPropertiesProps = Readonly<{
  stubborn?: boolean;
  dataSource: Data[];
  onChange?(dataSource: FCustomPropertiesProps['dataSource']): void;
  onSave?(dataSource: FCustomPropertiesProps['dataSource']): void;
  onImport?(): void;
}>;

export default function ({stubborn = false, dataSource, onChange, onImport, onSave}: FCustomPropertiesProps) {
  function onChangeProperty(value: Data, index: number) {
    return onChange && onChange(dataSource.map((i, j) => {
      if (index !== j) {
        return i;
      }
      return value;
    }));
  }

  function onDelete(index: number) {
    return onChange && onChange(dataSource.filter((i, j) => j !== index));
  }

  function onAdd() {
    return onChange && onChange([
      {key: '', value: '', description: '', allowCustom: false, custom: 'input', customOption: ''},
      ...dataSource,
    ]);
  }

  function onConfirm(value: Data, index: number) {
    onSave && onSave(dataSource.map((i, j) => {
      if (j !== index) {
        return i;
      }
      return value;
    }));
  }

  return (<>
    {
      !stubborn && (<>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton onClick={onAdd} theme="weaken"/>
            <FContentText text={i18nMessage('create_property')}/>
          </Space>
          <Space size={10}>
            <FCircleButton
              theme="weaken"
              icon={<CopyOutlined/>}
              onClick={() => onImport && onImport()}
            />
            <FContentText text={i18nMessage('import_from_previous_version')}/>
          </Space>
        </Space>

      </>)
    }

    {dataSource.length > 0 && <div className={styles.styles}>
      <div style={{height: 35}}/>
      {
        dataSource.map((i, j) => (<Property
          key={j}
          stubborn={stubborn}
          data={i}
          onChange={(value) => onChangeProperty(value, j)}
          onConfirm={(value) => onConfirm(value, j)}
          onDelete={() => onDelete(j)}
        />))
      }
    </div>}
  </>);
}

interface PropertyProps {
  data: Data;
  stubborn?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
  onConfirm?: (data: PropertyProps['data']) => void;
  onDelete?: () => void;
}


function Property({stubborn = false, data, onChange, onDelete, onConfirm}: PropertyProps) {
  const [editing, setEditing] = React.useState<'' | 'value' | 'remark'>('');
  const [valueText, setValueText] = React.useState<string>(data.value as string);
  const [descriptionText, setDescriptionText] = React.useState<string>(data.description as string);

  function onChangeData(kv: any) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  function onSave(kv: Partial<Data>) {
    onConfirm && onConfirm({
      ...data,
      ...kv,
    });
    setEditing('');
  }

  return (<FHorn
    extra={stubborn || (<a
      onClick={() => onDelete && onDelete()}
      className={styles.delete}
    >{i18nMessage('remove')}</a>)}
    className={styles.FHorn}>

    <div className={styles.row}>
      <Field title={i18nMessage('key')} dot={true}>
        <FInput
          wrapClassName={styles.FInputWrap}
          value={data.key}
          onChange={(e) => onChangeData({key: e.target.value})}
          disabled={stubborn}
        />
      </Field>
      <Field
        status={stubborn ? (editing === 'value' ? 'editing' : 'editable') : 'normal'}
        title={i18nMessage('value')}
        dot={true}
        onClickEdit={() => setEditing('value')}
        onClickCancel={() => setEditing('')}
        onClickConfirm={() => onSave({value: valueText})}
      >
        {stubborn && editing === 'value'
          ? <FInput
            wrapClassName={styles.FInputWrap}
            value={valueText}
            onChange={(e) => setValueText(e.target.value)}
          />
          : <FInput
            wrapClassName={styles.FInputWrap}
            value={data.value}
            onChange={(e) => onChangeData({value: e.target.value})}
            disabled={stubborn}
          />}
      </Field>
      <Field
        status={stubborn ? (editing === 'remark' ? 'editing' : 'editable') : 'normal'}
        title={i18nMessage('property_remark')}
        onClickEdit={() => setEditing('remark')}
        onClickCancel={() => setEditing('')}
        onClickConfirm={() => onSave({description: descriptionText})}
      >
        {stubborn && editing === 'remark'
          ? <FInput
            wrapClassName={styles.FInputWrap}
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
          />
          : (<FInput
            wrapClassName={styles.FInputWrap}
            value={data.description}
            onChange={(e) => onChangeData({description: e.target.value})}
            disabled={stubborn}
          />)}
      </Field>
      <Field title={i18nMessage('support_customization')}>
        <Switch
          checked={data.allowCustom}
          onChange={(value) => onChangeData({allowCustom: value})}
          disabled={stubborn}
          className={styles.Switch}
          size="default"
          defaultChecked
        />
      </Field>
    </div>

    {
      data.allowCustom && (<div className={styles.row}>
        <Field className={styles.FSelect} title={i18nMessage('value_input_mode')}>
          <FSelect
            value={data.custom}
            onChange={(value) => onChangeData({custom: value})}
            disabled={stubborn}
            className={styles.FSelect}
            dataSource={[
              {value: 'input', title: i18nMessage('textfield')},
              {value: 'select', title: i18nMessage('dropdownlist')},
            ]}
            placeholder={'请选择'}
          />
        </Field>
        {
          data.custom === 'select' && (<Field title={i18nMessage('value_options')} className={styles.customOptions}>
            <FInput
              // wrapClassName={}
              value={data.customOption}
              onChange={(e) => onChangeData({customOption: e.target.value})}
              disabled={stubborn}
            />
          </Field>)
        }

      </div>)
    }

  </FHorn>);
}


interface FieldProps {
  dot?: boolean;
  title: string;
  children?: React.ReactNode;
  className?: string;
  status?: 'normal' | 'editable' | 'editing';

  onClickEdit?(): void;

  onClickCancel?(): void;

  onClickConfirm?(): void;
}

function Field({status = 'normal', className, dot = false, title, children, onClickEdit, onClickCancel, onClickConfirm}: FieldProps) {
  return (<div className={styles.Field + ' ' + (className || '')}>
      <div className={styles.FieldTitle}>
        {dot && <i className={styles.dot}/>}
        <span>{title}</span>
      </div>
      <div style={{height: 5}}/>

      <FHorn extra={<>
        {
          status === 'editable' && (
            <FTextButton className={styles.editable} onClick={onClickEdit}>
              <EditOutlined/>
            </FTextButton>
          )
        }
        {
          status === 'editing' && (
            <Space size={10}>
              <FTextButton onClick={onClickCancel}>{i18nMessage('cancel')}</FTextButton>
              <FTextButton onClick={onClickConfirm} theme="primary">{i18nMessage('save')}</FTextButton>
            </Space>)
        }
      </>}>
        {children}
      </FHorn>
    </div>
  );
}
