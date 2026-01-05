#!/usr/bin/env python3
"""
grep -l "category: Study" _posts/*.md | xargs grep -h "tags:" | grep -o "\[.*\]"
명령어 결과를 파싱하여 중복 제거 후 tags.yml 파일 업데이트
"""
import subprocess
import re
import shutil
from datetime import datetime
from pathlib import Path
import sys

def cleanup_old_backups(backup_dir):
    """오래된 백업 파일 삭제 (최신 1개만 유지)"""
    backup_files = sorted(backup_dir.glob('tags.yml.backup_*'), reverse=True)
    
    # 최신 백업 1개를 제외한 나머지 삭제
    if len(backup_files) > 1:
        for old_backup in backup_files[1:]:
            old_backup.unlink()
            print(f"✓ 오래된 백업 파일 삭제: {old_backup.name}")

def restore_from_backup(tags_file):
    """가장 최근 백업 파일로 복구"""
    backup_dir = tags_file.parent
    backup_files = sorted(backup_dir.glob('tags.yml.backup_*'), reverse=True)
    
    if backup_files:
        latest_backup = backup_files[0]
        shutil.copy(latest_backup, tags_file)
        print(f"\n✓ 백업 파일로 복구 완료: {latest_backup.name} -> tags.yml")
        return True
    else:
        print("\n! 경고: 복구할 백업 파일이 없습니다.")
        return False

def extract_and_merge_tags():
    """Study 카테고리 파일들의 tags를 추출하고 병합"""
    
    # grep 명령어 실행
    cmd = 'grep -l "category: Study" _posts/*.md | xargs grep -h "tags:" | grep -o "\\[.*\\]"'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split('\n')
    except subprocess.CalledProcessError as e:
        raise Exception(f"grep 명령어 실행 실패: {e}")
    
    # 태그 추출 및 중복 제거
    all_tags = set()
    
    for line in lines:
        if not line.strip():
            continue
        
        # [tag1,tag2,tag3] 또는 [tag1, tag2, tag3] 형식에서 태그 추출
        # 괄호 제거
        tags_str = line.strip('[').strip(']')
        
        # 쉼표로 분리
        tags = tags_str.split(',')
        
        for tag in tags:
            # 공백과 따옴표 제거
            clean_tag = tag.strip().strip('"').strip("'")
            if clean_tag:
                all_tags.add(clean_tag)
    
    if not all_tags:
        raise Exception("추출된 태그가 없습니다.")
    
    # 정렬된 리스트 반환
    return sorted(all_tags)


if __name__ == '__main__':
    print("=" * 70)
    print("Study 카테고리 tags.yml 업데이트")
    print("=" * 70)
    
    tags_file = Path('_data/tags.yml')
    backup_dir = tags_file.parent
    
    try:
        print("\n1. Study 카테고리 파일에서 tags 추출 중...\n")
        tags = extract_and_merge_tags()
        
        print(f"✓ 추출된 태그 ({len(tags)}개):")
        for i, tag in enumerate(tags, 1):
            print(f"  {i:3d}. {tag}")
        
        # 기존 tags.yml 백업
        print(f"\n2. 백업 생성 중...")
        
        if tags_file.exists():
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = backup_dir / f'tags.yml.backup_{timestamp}'
            shutil.copy(tags_file, backup_file)
            print(f"✓ 기존 tags.yml 백업 완료: {backup_file.name}")
            
            # 오래된 백업 파일 삭제 (최신 1개만 유지)
            cleanup_old_backups(backup_dir)
        else:
            print(f"! 경고: {tags_file} 파일이 존재하지 않습니다. 새로 생성합니다.")
        
        # tags.yml 형식으로 새 파일 생성
        print(f"\n3. {tags_file} 업데이트 중...")
        with open(tags_file, 'w', encoding='utf-8') as f:
            for tag in tags:
                f.write(f"- {tag}\n")
        
        print(f"✓ {tags_file} 파일이 업데이트되었습니다.")
        
        print("\n" + "=" * 70)
        print("완료!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n!!! 오류 발생: {e}")
        print("\n백업 파일로 복구 시도 중...")
        
        if restore_from_backup(tags_file):
            print("\n" + "=" * 70)
            print("복구 완료 - 기존 tags.yml이 복원되었습니다.")
            print("=" * 70)
        else:
            print("\n" + "=" * 70)
            print("복구 실패 - 수동으로 백업 파일을 확인하세요.")
            print("=" * 70)
        
        sys.exit(1)
